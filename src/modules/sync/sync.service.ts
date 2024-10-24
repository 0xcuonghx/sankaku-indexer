import { Injectable, Logger } from '@nestjs/common';

const BLOCKS_PER_BATCH = 1000;
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  async realtimeSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Realtime syncing from block ${fromBlock} to block ${toBlock}`,
    );
    return this.sync(fromBlock, toBlock);
  }

  async backfillSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Backfill syncing from block ${fromBlock} to block ${toBlock}`,
    );
    // to stop the job from running into issues or taking too long, we dont want to sync a large amount of blocks in one job
    // if the fromBlock & toBlock have a large difference, split the job into smaller jobs
    // if the syncDetails are null, split the job into smaller jobs of 1 block
    // otherwise, split the job into smaller jobs of 1 blocks
    const diff = toBlock - fromBlock;
    const splitSize = BLOCKS_PER_BATCH;

    if (diff > splitSize) {
      const splitJobs = [];
      for (let i = fromBlock; i < toBlock; i += splitSize) {
        splitJobs.push({
          fromBlock: i,
          toBlock: Math.min(i + splitSize - 1, toBlock),
        });
      }

      for (const job of splitJobs) {
        await this.sync(job.fromBlock, job.toBlock, true);
      }
      return;
    }

    return this.sync(fromBlock, toBlock, true);
  }

  async sync(fromBlock: number, toBlock: number, backfill: boolean = false) {
    this.logger.debug(
      `Syncing from block ${fromBlock} to block ${toBlock} (backfill: ${backfill})`,
    );
  }
}
