import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { SubscriptionsFetcherJobData } from './subscriptions-fetcher.service';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { Logger } from '@nestjs/common';

@Processor(QueueType.SubscriptionsFetcher, {
  concurrency: 3,
})
export class SubscriptionsFetcherProcessor extends WorkerHost {
  private readonly logger = new Logger(SubscriptionsFetcherProcessor.name);
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    super();
  }

  async process(job: Job<SubscriptionsFetcherJobData>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    const { account } = job.data;
    return this.subscriptionsService.refetchByAccount(account);
  }
}
