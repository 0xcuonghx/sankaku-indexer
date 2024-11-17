import { Module } from '@nestjs/common';
import { InsertActivityLogService } from './insert-activity-log.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { InsertActivityLogProcessor } from './insert-activity-log.processor';
import { ActivityLogsModule } from 'src/modules/activity-logs/activity-logs.module';

@Module({
  imports: [
    ActivityLogsModule,
    BullModule.registerQueue({
      name: QueueType.InsertActivityLog,
    }),
    BullBoardModule.forFeature({
      name: QueueType.InsertActivityLog,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [InsertActivityLogService, InsertActivityLogProcessor],
  exports: [InsertActivityLogService],
})
export class InsertActivityLogModule {}
