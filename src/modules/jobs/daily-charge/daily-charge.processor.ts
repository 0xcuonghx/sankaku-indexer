import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import moment from 'moment';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { QueueType } from 'src/types/queue.type';
import { ChargeService } from '../charge/charge.service';

@Processor(QueueType.DailyCharge, {
  concurrency: 1,
})
export class DailyChargeProcessor extends WorkerHost {
  private readonly logger = new Logger(DailyChargeProcessor.name);

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly chargeService: ChargeService,
  ) {
    super();
  }

  async process() {
    this.logger.debug(
      `Daily charge running at ${moment().format(`YYYY-MM-DD HH:mm:ss`)}`,
    );
    const subscriptions = await this.subscriptionsService.getAccountsToCharge([
      moment().startOf('day').unix(),
      moment().endOf('day').unix(),
    ]);

    this.logger.debug(`Found ${subscriptions.length} subscriptions to charge`);

    await this.chargeService.addBulkJob(
      subscriptions.map(
        (subscription) => subscription.account,
      ) as `0x${string}`[],
    );
  }
}
