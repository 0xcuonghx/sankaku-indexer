import { Injectable, Logger } from '@nestjs/common';
import { getNetworkSettings } from 'src/config/network.config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueJobType, QueueType } from 'src/types/queue.type';

@Injectable()
export class BlockScannerService {
  constructor(
    @InjectQueue(QueueType.BlockScanner)
    private readonly blockScannerQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.addScanBlockRepeatJob();
  }

  async addScanBlockRepeatJob() {
    await this.blockScannerQueue.add(
      QueueJobType.ScanBlock,
      {},
      {
        removeOnComplete: true,
        removeOnFail: { count: 10 },
        jobId: QueueJobType.ScanBlock, // Ensure uniqueness of the job
        repeat: {
          pattern: `*/${getNetworkSettings().blockScanInterval} * * * * *`,
        },
      },
    );
  }
}
