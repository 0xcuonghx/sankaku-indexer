import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { SyncService } from '../sync/sync.service';

const BLOCK_SCAN_INTERVAL = 15; // seconds

@Injectable()
export class BlockScannerService {
  private readonly logger = new Logger(BlockScannerService.name);
  private lastSyncedBlock = 0;
  private lock = false;

  constructor(
    private readonly blockchainClientService: BlockchainClientService,
    private readonly syncService: SyncService,
  ) {}

  @Cron(`*/${BLOCK_SCAN_INTERVAL} * * * * *`)
  async scanBlocks() {
    try {
      if (this.lock) {
        return;
      }
      this.lock = true;
      this.logger.debug(`Scanning blocks every ${BLOCK_SCAN_INTERVAL} seconds`);

      // We allow syncing of up to `maxBlocks` blocks behind the
      // head of the blockchain. If the indexer lagged behind more
      // than that, then all blocks before that will be sent to the
      // backfill queue.
      const maxBlocks = 256;

      const headBlock = Number(
        await this.blockchainClientService.getBlockNumber(),
      );

      // Fetch the last synced blocked for the current contract type (if it exists)
      let localBlock = this.lastSyncedBlock + 1;
      if (localBlock >= headBlock) {
        // Nothing to sync
        return;
      }

      const fromBlock = Math.max(localBlock, headBlock - maxBlocks + 1);
      await this.syncService.realtimeSync(fromBlock, headBlock);

      // Queue any remaining blocks for backfilling
      if (localBlock < fromBlock) {
        await this.syncService.backfillSync(localBlock, fromBlock - 1);
      }

      // To avoid missing any events, save the latest synced block with a delay.
      // This will ensure that the latest blocks will get queried more than once,
      // which is exactly what we need (since events for the latest blocks might
      // be missing due to upstream chain reorgs):
      // https://ethereum.stackexchange.com/questions/109660/eth-getlogs-and-some-missing-logs
      this.lastSyncedBlock = headBlock - 5;
      this.lock = false;
    } catch (error) {
      this.lock = false;
      this.logger.error('Error scanning blocks', error);
    }
  }
}
