import { Module } from '@nestjs/common';
import { TokenBalancesFetcherService } from './token-balances-fetcher.service';
import { TokenBalancesModule } from 'src/modules/token-balances/token-balances.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TokenBalancesFetcherProcessor } from './token-balances-fetcher.processor';

@Module({
  imports: [
    TokenBalancesModule,
    BullModule.registerQueue({
      name: QueueType.TokenBalancesFetcher,
    }),
    BullBoardModule.forFeature({
      name: QueueType.TokenBalancesFetcher,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [TokenBalancesFetcherService, TokenBalancesFetcherProcessor],
  exports: [TokenBalancesFetcherService],
})
export class TokenBalancesFetcherModule {}
