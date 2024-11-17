import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartWalletCreateEventsEntity } from '../factory-handler/entities/smart-wallet-create-events.entity';
import { SmartAccountsService } from 'src/modules/smart-accounts/smart-accounts.service';
import { ActivityType } from 'src/modules/activity-logs/entities/activity-logs.entity';
import { BaseHandlerService } from '../types/base-handler.service';
import { BlocksService } from 'src/modules/blocks/blocks.service';
import { InsertActivityLogService } from 'src/modules/jobs/insert-activity-log/insert-activity-log.service';

@Injectable()
export class FactoryHandlerService extends BaseHandlerService {
  private readonly logger = new Logger(FactoryHandlerService.name);

  constructor(
    @InjectRepository(SmartWalletCreateEventsEntity)
    private smartWalletCreateEventsRepository: Repository<SmartWalletCreateEventsEntity>,
    private readonly smartAccountsService: SmartAccountsService,
    private readonly blocksService: BlocksService,
    private readonly insertActivityLogService: InsertActivityLogService,
  ) {
    super();
  }

  async handle(events: EnhancedEvent[], backfill = false) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'create':
          await this.handleCreate(subKindEvents, backfill);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }
  }

  async handleCreate(
    events: EnhancedEvent<'event AccountCreated(address indexed account, address indexed owner, bytes32 indexed salt)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} create events (backfill: ${backfill})`,
    );

    try {
      const insertedEvents = await this.smartWalletCreateEventsRepository
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
            account: event.log.args.account,
            owner: event.log.args.owner,
            salt: event.log.args.salt,
          })),
        )
        .orIgnore()
        .returning('*')
        .execute();

      const accounts = insertedEvents.raw.map((event) => ({
        account: event.account,
        owner: event.owner,
        salt: event.salt,
      }));

      await this.smartAccountsService.insert(accounts);

      // Create activity logs
      if (insertedEvents.raw.length !== 0) {
        const block = await this.blocksService.getBlockByHash(
          insertedEvents.raw[0].block_hash,
        );
        this.insertActivityLogService.addJob(
          insertedEvents.raw.map((event) => ({
            account: event.account,
            type: ActivityType.WalletCreated,
            timestamp: block.timestamp,
            data: { owner: event.owner, salt: event.salt },
          })),
        );
      }
    } catch (error) {
      this.logger.debug(error);
      this.logger.error(`Error handling create events: ${error.message}`);
    }
  }
}
