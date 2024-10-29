import { Module } from '@nestjs/common';
import { TokenBalancesService } from './token-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBalancesEntity } from './entities/token-balances.entity';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';

@Module({
  imports: [
    BlockchainClientModule,
    TypeOrmModule.forFeature([TokenBalancesEntity]),
  ],
  providers: [TokenBalancesService],
  exports: [TokenBalancesService],
})
export class TokenBalancesModule {}
