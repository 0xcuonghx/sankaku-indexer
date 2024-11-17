import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ChargeProcessor } from './charge.processor';
import { BlockchainClientModule } from 'src/modules/blockchain-client/blockchain-client.module';

@Module({
  imports: [
    BlockchainClientModule,
    BullModule.registerQueue({
      name: QueueType.Charge,
    }),
    BullBoardModule.forFeature({
      name: QueueType.Charge,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [ChargeService, ChargeProcessor],
  exports: [ChargeService],
})
export class ChargeModule {}
