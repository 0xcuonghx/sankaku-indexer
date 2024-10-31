import { Injectable, Logger } from '@nestjs/common';
import { EnhancedEvent } from 'src/types/event.type';
import { BaseHandlerService } from './base-handler.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ERC20TransferEventsEntity } from '../entities/erc20-transfer-events.entity';
import { Repository } from 'typeorm';
import { TokenBalancesService } from 'src/modules/token-balances/token-balances.service';

@Injectable()
export class ERC20HandlerService extends BaseHandlerService {
  private readonly logger = new Logger(ERC20HandlerService.name);

  constructor(
    @InjectRepository(ERC20TransferEventsEntity)
    private erc20TransferEventsRepository: Repository<ERC20TransferEventsEntity>,
    private readonly tokenBalancesService: TokenBalancesService,
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

    const fetchBalanceArgs = Array.from(
      new Set(
        eventInsertedRaw
          .map((event) => [
            { account: event.from, token: event.address },
            { account: event.to, token: event.address },
          ])
          .flat(),
      ),
    );
    this.tokenBalancesService.refetch(fetchBalanceArgs);
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
