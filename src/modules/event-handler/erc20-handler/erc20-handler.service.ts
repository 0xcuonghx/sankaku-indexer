import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityType } from 'src/modules/activity-logs/entities/activity-logs.entity';
import { BaseHandlerService } from '../types/base-handler.service';
import { ERC20TransferEventsEntity } from './entities/erc20-transfer-events.entity';
import { BlocksService } from 'src/modules/blocks/blocks.service';
import { TokenBalancesFetcherService } from 'src/modules/jobs/token-balances-fetcher/token-balances-fetcher.service';
import { zeroAddress } from 'viem';
import { InsertActivityLogService } from 'src/modules/jobs/insert-activity-log/insert-activity-log.service';

@Injectable()
export class ERC20HandlerService extends BaseHandlerService {
  private readonly logger = new Logger(ERC20HandlerService.name);

  constructor(
    @InjectRepository(ERC20TransferEventsEntity)
    private erc20TransferEventsRepository: Repository<ERC20TransferEventsEntity>,
    private readonly blocksService: BlocksService,
    private readonly tokenBalancesFetcherService: TokenBalancesFetcherService,
    private readonly insertActivityLogService: InsertActivityLogService,
  ) {
    super();
  }

  async handle(
    events: EnhancedEvent<'event Transfer(address indexed from, address indexed to, uint256 value)'>[],
    backfill = false,
  ) {
    this.logger.debug(`Found ${events.length} events (backfill: ${backfill})`);

    const eventsPerSubKind = this.batchEventsBySubKind(events);

    let eventInsertedRaw: any[] = [];

    for (const subKind in eventsPerSubKind) {
      const subKindEvents = eventsPerSubKind[subKind];
      switch (subKind) {
        case 'erc20-transfer':
          const transferInserted = await this.handleTransfer(
            subKindEvents,
            backfill,
          );
          eventInsertedRaw = eventInsertedRaw.concat(transferInserted.raw);
          break;
        default:
          throw new Error(`Unknown event sub-kind: ${subKind}`);
      }
    }

    // Refetch token balances for accounts involved in the transfer
    const fetchBalanceArgs = Array.from(
      new Set(
        eventInsertedRaw
          .map((event) => [
            { account: event.from, token: event.address },
            { account: event.to, token: event.address },
          ])
          .flat(),
      ),
    ).filter((args) => args.account !== zeroAddress);

    await this.tokenBalancesFetcherService.addBulkJob(fetchBalanceArgs);

    // Create activity logs for the transfer events
    if (eventInsertedRaw.length === 0) {
      return;
    }
    const block = await this.blocksService.getBlockByHash(
      eventInsertedRaw[0].block_hash,
    );

    await this.insertActivityLogService.addJob(
      eventInsertedRaw
        .map((event) => [
          {
            account: event.from,
            type: ActivityType.TokenTransferred,
            timestamp: block.timestamp,
            data: { to: event.to, token: event.address, amount: event.amount },
          },
          {
            account: event.to,
            type: ActivityType.TokenReceived,
            timestamp: block.timestamp,
            data: {
              from: event.from,
              token: event.address,
              amount: event.amount,
            },
          },
        ])
        .flat(),
    );
  }

  async handleTransfer(
    events: EnhancedEvent<'event Transfer(address indexed from, address indexed to, uint256 value)'>[],
    backfill = false,
  ) {
    this.logger.debug(
      `Found ${events.length} transfer events (backfill: ${backfill})`,
    );

    return this.erc20TransferEventsRepository
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
          from: event.log.args.from,
          to: event.log.args.to,
          amount: event.log.args.value.toString(),
        })),
      )
      .orIgnore()
      .returning('*')
      .execute();
  }
}
