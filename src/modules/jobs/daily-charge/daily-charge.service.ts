import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

@Injectable()
export class DailyChargeService {
  constructor(
    @InjectQueue(QueueType.DailyCharge)
    private readonly dailyChargeQueue: Queue,
  ) {}

  async addScanBlockRepeatJob() {
    await this.dailyChargeQueue.add(
      QueueJobType.DailyCharge,
      {},
      {
        removeOnComplete: true,
        removeOnFail: { count: 10 },
        jobId: QueueJobType.DailyCharge, // Ensure uniqueness of the job
        repeat: {
          pattern: CronExpression.EVERY_DAY_AT_1AM,
        },
      },
    );
  }
}
