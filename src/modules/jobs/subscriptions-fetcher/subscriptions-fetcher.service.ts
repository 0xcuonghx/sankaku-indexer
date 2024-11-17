import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

export type SubscriptionsFetcherJobData = {
  account: `0x${string}`;
};

@Injectable()
export class SubscriptionsFetcherService {
  constructor(
    @InjectQueue(QueueType.SubscriptionsFetcher)
    private readonly SubscriptionsFetcherQueue: Queue,
  ) {}

  async addBulkJob(accounts: `0x${string}`[]) {
    return this.SubscriptionsFetcherQueue.addBulk(
      accounts.map((account) => ({
        name: QueueJobType.FetchSubscriptions,
        data: { account },
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
