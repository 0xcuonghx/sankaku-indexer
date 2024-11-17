import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

export interface TokenBalancesFetcherJobData {
  account: `0x${string}`;
  token: `0x${string}`;
}

@Injectable()
export class TokenBalancesFetcherService {
  constructor(
    @InjectQueue(QueueType.TokenBalancesFetcher)
    private readonly tokenBalancesFetcherQueue: Queue,
  ) {}

  async addBulkJob(jobs: TokenBalancesFetcherJobData[]) {
    return this.tokenBalancesFetcherQueue.addBulk(
      jobs.map((jobData) => ({
        name: QueueJobType.FetchTokenBalances,
        data: jobData,
        opts: {
          removeOnComplete: true,
          removeOnFail: { count: 10 },
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      })),
    );
  }
}
