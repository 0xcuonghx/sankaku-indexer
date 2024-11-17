import { Injectable, Logger } from '@nestjs/common';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { getEventInterfaces } from 'src/abis';
import { EnhancedEvent, EnhancedEventsByKind } from 'src/types/event.type';
import { EventHandlerService } from '../event-handler/event-handler.service';
import { BlocksService } from '../blocks/blocks.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private readonly blockchainClientService: BlockchainClientService,
    private readonly eventHandlerService: EventHandlerService,
    private readonly blocksService: BlocksService,
  ) {}

  async sync(fromBlock: number, toBlock: number, backfill: boolean = false) {
    try {
      this.logger.debug(
        `Syncing from block ${fromBlock} to block ${toBlock} (backfill: ${backfill})`,
      );

      const blocks = await this.blockchainClientService.getBlocks(
        fromBlock,
        toBlock,
      );

      if (!blocks) {
        throw new Error(
          `Blocks ${fromBlock} to ${toBlock} not found with RPC provider`,
        );
      }

      await this.blocksService.insert(blocks);

      const eventInterfaces = getEventInterfaces();
      const eventAbis = eventInterfaces.map((iface) => iface.abi);
      const logs = await this.blockchainClientService.publicClient.getLogs({
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
        events: eventAbis,
      });

      const enhancedEvents: EnhancedEvent[] = logs
        .map((log) => {
          return eventInterfaces
            .filter(
              ({ addresses, topic, numberOfTopics }) =>
                topic === log.topics[0] &&
                numberOfTopics === log.topics.length &&
                (addresses ? addresses[log.address.toLowerCase()] : true),
            )
            .map(({ kind, subKind }) => ({
              kind,
              subKind,
              log,
            }));
        })
        .flat()
        .filter((event) => event);

      if (!enhancedEvents.length) {
        return;
      }

      const eventsByKind = this.batchEventsByKind(enhancedEvents);
      await this.eventHandlerService.handleEvents(eventsByKind, backfill);
    } catch (error) {
      this.logger.error(
        `Error syncing from block ${fromBlock} to block ${toBlock} (backfill: ${backfill})`,
      );
      this.logger.debug(error);

      if (error?.status === 429) {
        this.logger.debug('Rate limited');
      }

      throw error;
    }
  }

  private batchEventsByKind(
    enhancedEvents: EnhancedEvent[],
  ): EnhancedEventsByKind {
    return enhancedEvents.reduce((eventsByKind, event) => {
      if (!eventsByKind[event.kind]) {
        eventsByKind[event.kind] = [];
      }
      eventsByKind[event.kind].push(event);
      return eventsByKind;
    }, {});
  }
}
