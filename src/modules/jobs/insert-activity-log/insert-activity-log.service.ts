import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ActivityType } from 'src/modules/activity-logs/entities/activity-logs.entity';
import { QueueJobType, QueueType } from 'src/types/queue.type';

export type InsertActivityLogJobData = {
  account: `0x${string}`;
  type: ActivityType;
  timestamp: number;
  data: Record<string, any>;
}[];

@Injectable()
export class InsertActivityLogService {
  constructor(
    @InjectQueue(QueueType.InsertActivityLog)
    private readonly insertActivityLogQueue: Queue,
  ) {}

  async addJob(data: InsertActivityLogJobData) {
    return this.insertActivityLogQueue.add(
      QueueJobType.InsertActivityLog,
      data,
      {
        removeOnComplete: { count: 10 },
        removeOnFail: { count: 10 },
      },
    );
  }
}
