import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { TokenBalancesFetcherJobData } from './token-balances-fetcher.service';
import { TokenBalancesService } from 'src/modules/token-balances/token-balances.service';

@Processor(QueueType.TokenBalancesFetcher, {
  concurrency: 3,
})
export class TokenBalancesFetcherProcessor extends WorkerHost {
  constructor(private readonly tokenBalancesService: TokenBalancesService) {
    super();
  }

  async process(job: Job<TokenBalancesFetcherJobData>) {
    const { account, token } = job.data;
    return this.tokenBalancesService.refetchByAccount(account, token);
  }
}
