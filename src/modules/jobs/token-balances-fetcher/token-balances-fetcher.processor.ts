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
  private readonly logger = new Logger(TokenBalancesFetcherProcessor.name);
  constructor(private readonly tokenBalancesService: TokenBalancesService) {
    super();
  }

  async process(job: Job<TokenBalancesFetcherJobData>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    const { account, token } = job.data;
    return this.tokenBalancesService.refetchByAccount(account, token);
  }
}
