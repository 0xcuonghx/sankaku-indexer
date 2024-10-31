import { Injectable, Logger } from '@nestjs/common';
import { BaseHandlerService } from './base-handler.service';
import { EnhancedEvent } from 'src/types/event.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringExecutorExecuteEventsEntity } from '../entities/recurring-executor-execute.entity';
import { RecurringExecutorInstallEventsEntity } from '../entities/recurring-executor-install.entity';
import { RecurringExecutorUninstallEventsEntity } from '../entities/recurring-executor-uninstall.entity';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventChannel } from 'src/types/internal-event.type';

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
    private readonly subscriptionsService: SubscriptionsService,
    private eventEmitter: EventEmitter2,
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

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'install':
          await this.handleInstall(subKindEvents, backfill);
          break;
        case 'uninstall':
          await this.handleUninstall(subKindEvents, backfill);
          break;
        case 'execute':
          await this.handleExecute(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }

    const accounts = Array.from(
      new Set(events.map((event) => event.log.args.smartAccount)),
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

    if (!backfill) {
      insertedEvents.raw.forEach((event) => {
        this.eventEmitter.emit(EventChannel.RecurringExecutorInstalled, {
          account: event.account,
        });
      });
    }
  }

  async handleUninstall(
    events: EnhancedEvent<'event RecurringExecutionRemoved(address indexed smartAccount)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} uninstall events (backfill: ${backfill})`,
    );
    await this.recurringExecutorUninstallEventsRepository
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
      .execute();
  }

  async handleExecute(
    events: EnhancedEvent<'event RecurringExecutionAdded(address indexed smartAccount,uint256 planId, uint8 basis,address receiver,address token,uint256 amount)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} execute events (backfill: ${backfill})`,
    );
    await this.recurringExecutorExecuteEventsRepository
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
      .execute();
  }
}
