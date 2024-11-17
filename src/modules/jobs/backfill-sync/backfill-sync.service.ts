import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { getNetworkSettings } from 'src/config/network.config';
import { QueueJobType, QueueType } from 'src/types/queue.type';

@Injectable()
export class BackfillSyncService {
  private readonly logger = new Logger(BackfillSyncService.name);

  constructor(
    @InjectQueue(QueueType.BackfillSync)
    private readonly backfillSyncQueue: Queue,
  ) {}

  async addJob(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Backfill syncing from block ${fromBlock} to block ${toBlock}`,
    );
    // to stop the job from running into issues or taking too long, we dont want to sync a large amount of blocks in one job
    // if the fromBlock & toBlock have a large difference, split the job into smaller jobs
    // if the syncDetails are null, split the job into smaller jobs of 1 block
    // otherwise, split the job into smaller jobs of 1 blocks
    const diff = toBlock - fromBlock;
    const splitSize = getNetworkSettings().blocksPerBatch;

    if (diff > splitSize) {
      const splitJobs = [];
      for (let i = fromBlock; i < toBlock; i += splitSize) {
        splitJobs.push({
          fromBlock: i,
          toBlock: Math.min(i + splitSize - 1, toBlock),
        });
      }

      await this.backfillSyncQueue.addBulk(
        splitJobs.map((job) => ({
          name: QueueJobType.BackfillSync,
          data: {
            fromBlock: job.fromBlock,
            toBlock: job.toBlock,
          },
          opts: {
            removeOnComplete: { count: 10 },
            removeOnFail: { count: 10 },
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          },
        })),
      );
      return;
    }

    return this.backfillSyncQueue.add(
      QueueJobType.BackfillSync,
      {
        fromBlock,
        toBlock,
      },
      {
        removeOnComplete: { count: 10 },
        removeOnFail: { count: 10 },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}
