import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

export interface InitialChargeJobData {
  account: `0x${string}`;
}

@Injectable()
export class InitialChargeService {
  constructor(
    @InjectQueue(QueueType.InitialCharge)
    private readonly initialChargeQueue: Queue,
  ) {}

  async addBulkJob(accounts: `0x${string}`[]) {
    return this.initialChargeQueue.addBulk(
      accounts.map((account) => ({
        name: QueueJobType.InitialCharge,
        data: { account },
        opts: {
          removeOnComplete: true,
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
}
