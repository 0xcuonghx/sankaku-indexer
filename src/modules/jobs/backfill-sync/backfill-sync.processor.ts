import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SyncService } from 'src/modules/sync/sync.service';
import { QueueType } from 'src/types/queue.type';

@Processor(QueueType.BackfillSync, {
  concurrency: 3,
})
export class BackfillSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(BackfillSyncProcessor.name);

  constructor(private readonly syncService: SyncService) {
    super();
  }

  async process(job: Job<{ fromBlock: number; toBlock: number }>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    const { fromBlock, toBlock } = job.data;
    await this.syncService.sync(fromBlock, toBlock, true);
  }
}
