import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SyncService } from 'src/modules/sync/sync.service';
import { QueueType } from 'src/types/queue.type';

@Processor(QueueType.BackfillSync, {
  concurrency: 3,
})
export class BackfillSyncProcessor extends WorkerHost {
  constructor(private readonly syncService: SyncService) {
    super();
  }

  async process(job: Job<{ fromBlock: number; toBlock: number }>) {
    const { fromBlock, toBlock } = job.data;
    await this.syncService.sync(fromBlock, toBlock, true);
  }
}
