import { Module } from '@nestjs/common';
import { SubscriptionsFetcherService } from './subscriptions-fetcher.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { SubscriptionsFetcherProcessor } from './subscriptions-fetcher.processor';
import { SubscriptionsModule } from 'src/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    SubscriptionsModule,
    BullModule.registerQueue({
      name: QueueType.SubscriptionsFetcher,
    }),
    BullBoardModule.forFeature({
      name: QueueType.SubscriptionsFetcher,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [SubscriptionsFetcherService, SubscriptionsFetcherProcessor],
  exports: [SubscriptionsFetcherService],
})
export class SubscriptionsFetcherModule {}
