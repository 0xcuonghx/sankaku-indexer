import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { InsertActivityLogJobData } from './insert-activity-log.service';
import { ActivityLogsService } from 'src/modules/activity-logs/activity-logs.service';

@Processor(QueueType.InsertActivityLog, {
  concurrency: 3,
})
export class InsertActivityLogProcessor extends WorkerHost {
  private readonly logger = new Logger(InsertActivityLogProcessor.name);
  constructor(private readonly activityLogsService: ActivityLogsService) {
    super();
  }

  async process(job: Job<InsertActivityLogJobData>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    return this.activityLogsService.save(job.data);
  }
}
