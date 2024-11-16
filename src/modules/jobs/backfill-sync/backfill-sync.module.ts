import { Module } from '@nestjs/common';
import { BackfillSyncService } from './backfill-sync.service';
import { SyncModule } from 'src/modules/sync/sync.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BackfillSyncProcessor } from './backfill-sync.processor';

@Module({
  imports: [
    SyncModule,
    BullModule.registerQueue({
      name: QueueType.BackfillSync,
    }),
    BullBoardModule.forFeature({
      name: QueueType.BackfillSync,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [BackfillSyncService, BackfillSyncProcessor],
  exports: [BackfillSyncService],
})
export class BackfillSyncModule {}
