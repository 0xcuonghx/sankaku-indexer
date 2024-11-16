import { Injectable, Logger } from '@nestjs/common';
import { getNetworkSettings } from 'src/config/network.config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

@Injectable()
export class BlockScannerService {
  private readonly logger = new Logger(BlockScannerService.name);
  private lock = false;

  constructor(
    @InjectQueue(QueueType.BlockScanner)
    private readonly blockScannerQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.addScanBlockRepeatJob();
  }
  // @Cron(`*/${getNetworkSettings().blockScanInterval} * * * * *`)
  // async scanBlocks() {
  //   try {
  //     if (this.lock) {
  //       return;
  //     }
  //     this.lock = true;
  //     this.logger.debug(
  //       `Scanning blocks every ${getNetworkSettings().blockScanInterval} seconds`,
  //     );

  //     // We allow syncing of up to `maxBlocks` blocks behind the
  //     // head of the blockchain. If the indexer lagged behind more
  //     // than that, then all blocks before that will be sent to the
  //     // backfill queue.
  //     const maxBlocks = getNetworkSettings().blocksPerBatch;

  //     const headBlock = Number(
  //       await this.blockchainClientService.getBlockNumber(),
  //     );

  //     // Fetch the last synced blocked for the current contract type (if it exists)
  //     let localBlock =
  //       (await this.cacheManager.get<number>('last_synced_block')) ||
  //       getNetworkSettings().startBlock + 1;

  //     if (localBlock >= headBlock) {
  //       // Nothing to sync
  //       return;
  //     }

  //     const fromBlock = Math.max(localBlock, headBlock - maxBlocks + 1);
  //     await this.syncService.realtimeSync(fromBlock, headBlock);

  //     // Queue any remaining blocks for backfilling
  //     if (localBlock < fromBlock) {
  //       this.syncService.backfillSync(localBlock, fromBlock - 1);
  //     }

  //     // To avoid missing any events, save the latest synced block with a delay.
  //     // This will ensure that the latest blocks will get queried more than once,
  //     // which is exactly what we need (since events for the latest blocks might
  //     // be missing due to upstream chain reorgs):
  //     // https://ethereum.stackexchange.com/questions/109660/eth-getlogs-and-some-missing-logs
  //     await this.cacheManager.set('last_synced_block', headBlock - 5);

  //     this.lock = false;
  //   } catch (error) {
  //     this.lock = false;
  //     this.logger.error('Error scanning blocks');
  //     this.logger.debug(error);
  //   }
  // }

  async addScanBlockRepeatJob() {
    await this.blockScannerQueue.add(
      QueueJobType.ScanBlock,
      {},
      {
        removeOnComplete: true,
        jobId: QueueJobType.ScanBlock, // Ensure uniqueness of the job
        repeat: {
          pattern: `*/${getNetworkSettings().blockScanInterval} * * * * *`,
        },
      },
    );
  }
}
