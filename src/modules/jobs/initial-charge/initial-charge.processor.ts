import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { InitialChargeJobData } from './initial-charge.service';
import { ChargeService } from 'src/modules/charge/charge.service';

@Processor(QueueType.InitialCharge, {
  concurrency: 1,
})
export class InitialChargeProcessor extends WorkerHost {
  constructor(private readonly chargeService: ChargeService) {
    super();
  }

  async process(job: Job<InitialChargeJobData>) {
    return this.chargeService.immediate(job.data.account);
  }
}
