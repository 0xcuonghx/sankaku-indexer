import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { SubscriptionsFetcherJobData } from './subscriptions-fetcher.service';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';

@Processor(QueueType.SubscriptionsFetcher, {
  concurrency: 3,
})
export class SubscriptionsFetcherProcessor extends WorkerHost {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    super();
  }

  async process(job: Job<SubscriptionsFetcherJobData>) {
    const { account } = job.data;
    return this.subscriptionsService.refetchByAccount(account);
  }
}
