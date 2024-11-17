import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { InitialChargeJobData } from './initial-charge.service';
import { ChargeService } from '../charge/charge.service';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { Logger } from '@nestjs/common';

@Processor(QueueType.InitialCharge, {
  concurrency: 1,
})
export class InitialChargeProcessor extends WorkerHost {
  private readonly logger = new Logger(InitialChargeProcessor.name);
  constructor(
    private readonly chargeService: ChargeService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {
    super();
  }

  async process(job: Job<InitialChargeJobData>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    const subscription = await this.subscriptionsService.getSubscription(
      job.data.account,
    );

    if (subscription && subscription.last_execution_timestamp !== 0) {
      // Already charged
      return;
    }
    return this.chargeService.addJob(job.data.account);
  }
}
