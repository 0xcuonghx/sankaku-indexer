import { Module } from '@nestjs/common';
import { TokenBalancesService } from './token-balances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBalancesEntity } from './entities/token-balances.entity';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { TokenBalancesController } from './token-balances.controller';

@Module({
  imports: [
    BlockchainClientModule,
    TypeOrmModule.forFeature([TokenBalancesEntity]),
  ],
  controllers: [TokenBalancesController],
  providers: [TokenBalancesService],
  exports: [TokenBalancesService],
})
export class TokenBalancesModule {}
