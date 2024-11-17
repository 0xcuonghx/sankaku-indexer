import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityType } from 'src/modules/activity-logs/entities/activity-logs.entity';
import { BaseHandlerService } from '../types/base-handler.service';
import { RecurringExecutorExecuteEventsEntity } from './entities/recurring-executor-execute-events.entity';
import { RecurringExecutorInstallEventsEntity } from './entities/recurring-executor-install-events.entity';
import { RecurringExecutorUninstallEventsEntity } from './entities/recurring-executor-uninstall-events.entity';
import { BlocksService } from 'src/modules/blocks/blocks.service';
import { InsertActivityLogService } from 'src/modules/jobs/insert-activity-log/insert-activity-log.service';
import { InitialChargeService } from 'src/modules/jobs/initial-charge/initial-charge.service';

@Injectable()
export class RecurringExecutorHandlerService extends BaseHandlerService {
  private readonly logger = new Logger(RecurringExecutorHandlerService.name);

  constructor(
    @InjectRepository(RecurringExecutorExecuteEventsEntity)
    private recurringExecutorExecuteEventsRepository: Repository<RecurringExecutorExecuteEventsEntity>,
    @InjectRepository(RecurringExecutorInstallEventsEntity)
    private recurringExecutorInstallEventsRepository: Repository<RecurringExecutorInstallEventsEntity>,
    @InjectRepository(RecurringExecutorUninstallEventsEntity)
    private recurringExecutorUninstallEventsRepository: Repository<RecurringExecutorUninstallEventsEntity>,
    private readonly blocksService: BlocksService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly insertActivityLogService: InsertActivityLogService,
    private readonly initialChargeService: InitialChargeService,
  ) {
    super();
  }

  async handle(
    events: EnhancedEvent<
      | 'event RecurringExecutionAdded(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)'
      | 'event RecurringExecutionRemoved(address indexed smartAccount)'
      | 'event RecurringExecutionRemoved(address indexed smartAccount)'
    >[],
    backfill = false,
  ) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    let eventInsertedRaws: any[] = [];
    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      let eventInserted: InsertResult;

      switch (subKind) {
        case 'install':
          eventInserted = await this.handleInstall(subKindEvents, backfill);
          break;
        case 'uninstall':
          eventInserted = await this.handleUninstall(subKindEvents, backfill);
          break;
        case 'execute':
          eventInserted = await this.handleExecute(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }

      eventInsertedRaws = eventInsertedRaws.concat(eventInserted.raw);
    }

    const accounts = Array.from(
      new Set(eventInsertedRaws.map((event) => event.account)),
    );
    this.subscriptionsService.refetch(accounts);
  }

  async handleInstall(
    events: EnhancedEvent<'event RecurringExecutionAdded(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} install events (backfill: ${backfill})`,
    );
    const insertedEvents = await this.recurringExecutorInstallEventsRepository
      .createQueryBuilder()
      .insert()
      .values(
        events.map((event) => ({
          log_index: event.log.logIndex,
          tx_hash: event.log.transactionHash,
          block_hash: event.log.blockHash,
          tx_index: event.log.transactionIndex,
          block: Number(event.log.blockNumber),
          address: event.log.address,
          account: event.log.args.smartAccount,
          planId: event.log.args.planId.toString(),
          basis: event.log.args.basis,
          receiver: event.log.args.receiver,
          token: event.log.args.token,
          amount: event.log.args.amount.toString(),
        })),
      )
      .orIgnore()
      .returning('*')
      .execute();

    // Initial charge
    if (!backfill) {
      await this.initialChargeService.addBulkJob(
        insertedEvents.raw.map((event) => event.account),
      );
    }

    // Create activity logs
    if (insertedEvents.raw.length !== 0) {
      const block = await this.blocksService.getBlockByHash(
        insertedEvents.raw[0].block_hash,
      );

      await this.insertActivityLogService.addJob(
        insertedEvents.raw.map((event) => ({
          account: event.account,
          type: ActivityType.RecurringExecutionInstalled,
          timestamp: block.timestamp,
          data: {
            planId: event.planId,
            basis: event.basis,
            receiver: event.receiver,
            token: event.token,
            amount: event.amount,
          },
        })),
      );
    }

    return insertedEvents;
  }

  async handleUninstall(
    events: EnhancedEvent<'event RecurringExecutionRemoved(address indexed smartAccount)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} uninstall events (backfill: ${backfill})`,
    );
    const insertedEvents = await this.recurringExecutorUninstallEventsRepository
      .createQueryBuilder()
      .insert()
      .values(
        events.map((event) => ({
          log_index: event.log.logIndex,
          tx_hash: event.log.transactionHash,
          block_hash: event.log.blockHash,
          tx_index: event.log.transactionIndex,
          block: Number(event.log.blockNumber),
          address: event.log.address,
          account: event.log.args.smartAccount,
        })),
      )
      .orIgnore()
      .returning('*')
      .execute();

    // Create activity logs
    if (insertedEvents.raw.length !== 0) {
      const block = await this.blocksService.getBlockByHash(
        insertedEvents.raw[0].block_hash,
      );

      await this.insertActivityLogService.addJob(
        insertedEvents.raw.map((event) => ({
          account: event.account,
          type: ActivityType.RecurringExecutionUninstalled,
          timestamp: block.timestamp,
        })),
      );
    }

    return insertedEvents;
  }

  async handleExecute(
    events: EnhancedEvent<'event RecurringExecutionAdded(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} execute events (backfill: ${backfill})`,
    );
    const insertedEvents = await this.recurringExecutorExecuteEventsRepository
      .createQueryBuilder()
      .insert()
      .values(
        events.map((event) => ({
          log_index: event.log.logIndex,
          tx_hash: event.log.transactionHash,
          block_hash: event.log.blockHash,
          tx_index: event.log.transactionIndex,
          block: Number(event.log.blockNumber),
          address: event.log.address,
          account: event.log.args.smartAccount,
          planId: event.log.args.planId.toString(),
          basis: event.log.args.basis,
          receiver: event.log.args.receiver,
          token: event.log.args.token,
          amount: event.log.args.amount.toString(),
        })),
      )
      .orIgnore()
      .returning('*')
      .execute();

    // Create activity logs
    if (insertedEvents.raw.length !== 0) {
      const block = await this.blocksService.getBlockByHash(
        insertedEvents.raw[0].block_hash,
      );

      this.insertActivityLogService.addJob(
        insertedEvents.raw.map((event) => ({
          account: event.account,
          type: ActivityType.RecurringExecutionExecuted,
          timestamp: block.timestamp,
          data: {
            planId: event.planId,
            basis: event.basis,
            receiver: event.receiver,
            token: event.token,
            amount: event.amount,
          },
        })),
      );
    }

    return insertedEvents;
  }
}
