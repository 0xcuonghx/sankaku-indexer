import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

export interface ChargeJobData {
  account: `0x${string}`;
}

@Injectable()
export class ChargeService {
  constructor(
    @InjectQueue(QueueType.Charge)
    private readonly chargeQueue: Queue,
  ) {}

  async addBulkJob(accounts: `0x${string}`[]) {
    return this.chargeQueue.addBulk(
      accounts.map((account) => ({
        name: QueueJobType.Charge,
        data: { account },
        opts: {
          removeOnComplete: { count: 10 },
          removeOnFail: { count: 10 },
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      })),
    );
  }

  async addJob(account: `0x${string}`) {
    return this.chargeQueue.add(
      QueueJobType.Charge,
      { account },
      {
        removeOnComplete: { count: 10 },
        removeOnFail: { count: 10 },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}
