import { Module } from '@nestjs/common';
import { InitialChargeService } from './initial-charge.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { InitialChargeProcessor } from './initial-charge.processor';
import { ChargeModule } from '../charge/charge.module';
import { SubscriptionsModule } from 'src/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ChargeModule,
    SubscriptionsModule,
    BullModule.registerQueue({
      name: QueueType.InitialCharge,
    }),
    BullBoardModule.forFeature({
      name: QueueType.InitialCharge,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [InitialChargeService, InitialChargeProcessor],
  exports: [InitialChargeService],
})
export class InitialChargeModule {}
