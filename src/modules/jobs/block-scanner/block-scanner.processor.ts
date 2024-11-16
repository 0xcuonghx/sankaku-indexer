import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { getNetworkSettings } from 'src/config/network.config';
import { QueueType } from 'src/types/queue.type';
import { SyncService } from '../../sync/sync.service';
import { BlockchainClientService } from '../../blockchain-client/blockchain-client.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Processor(QueueType.BlockScanner, { concurrency: 1 })
export class BlockScannerProcessor extends WorkerHost {
  private readonly logger = new Logger(BlockScannerProcessor.name);

  constructor(
    private readonly blockchainClientService: BlockchainClientService,
    private readonly syncService: SyncService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  async process() {
    try {
      this.logger.debug(
        `Scanning blocks every ${getNetworkSettings().blockScanInterval} seconds`,
      );

      // We allow syncing of up to `maxBlocks` blocks behind the
      // head of the blockchain. If the indexer lagged behind more
      // than that, then all blocks before that will be sent to the
      // backfill queue.
      const maxBlocks = getNetworkSettings().blocksPerBatch;

      const headBlock = Number(
        await this.blockchainClientService.getBlockNumber(),
      );

      // Fetch the last synced blocked for the current contract type (if it exists)
      let localBlock =
        (await this.cacheManager.get<number>('last_synced_block')) ||
        getNetworkSettings().startBlock + 1;

      if (localBlock >= headBlock) {
        // Nothing to sync
        return;
      }

      const fromBlock = Math.max(localBlock, headBlock - maxBlocks + 1);
      await this.syncService.realtimeSync(fromBlock, headBlock);

      // Queue any remaining blocks for backfilling
      if (localBlock < fromBlock) {
        this.syncService.backfillSync(localBlock, fromBlock - 1);
      }

      // To avoid missing any events, save the latest synced block with a delay.
      // This will ensure that the latest blocks will get queried more than once,
      // which is exactly what we need (since events for the latest blocks might
      // be missing due to upstream chain reorgs):
      // https://ethereum.stackexchange.com/questions/109660/eth-getlogs-and-some-missing-logs
      await this.cacheManager.set('last_synced_block', headBlock - 5);
    } catch (error) {
      this.logger.error('Error scanning blocks');
      this.logger.debug(error);
    }
  }
}
