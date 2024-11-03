import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERC20HandlerService } from './erc20-handler.service';
import { ERC20TransferEventsEntity } from './entities/erc20-transfer-events.entity';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { TokenBalancesModule } from 'src/modules/token-balances/token-balances.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ERC20TransferEventsEntity]),
    BlocksModule,
    TokenBalancesModule,
  ],
  providers: [ERC20HandlerService],
  exports: [ERC20HandlerService],
})
export class ERC20HandlerModule {}
