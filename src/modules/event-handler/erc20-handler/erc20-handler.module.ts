import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERC20HandlerService } from './erc20-handler.service';
import { ERC20TransferEventsEntity } from './entities/erc20-transfer-events.entity';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { TokenBalancesFetcherModule } from 'src/modules/jobs/token-balances-fetcher/token-balances-fetcher.module';
import { InsertActivityLogModule } from 'src/modules/jobs/insert-activity-log/insert-activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ERC20TransferEventsEntity]),
    BlocksModule,
    TokenBalancesFetcherModule,
    InsertActivityLogModule,
  ],
  providers: [ERC20HandlerService],
  exports: [ERC20HandlerService],
})
export class ERC20HandlerModule {}
