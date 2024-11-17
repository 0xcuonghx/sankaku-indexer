import { Module } from '@nestjs/common';
import { DailyChargeService } from './daily-charge.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { DailyChargeProcessor } from './daily-charge.processor';
import { ChargeModule } from '../charge/charge.module';
import { SubscriptionsModule } from 'src/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ChargeModule,
    SubscriptionsModule,
    BullModule.registerQueue({
      name: QueueType.DailyCharge,
    }),
    BullBoardModule.forFeature({
      name: QueueType.DailyCharge,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [DailyChargeService, DailyChargeProcessor],
  exports: [DailyChargeService],
})
export class DailyChargeModule {}
