import { Module } from '@nestjs/common';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { ChargeService } from './charge.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [BlockchainClientModule, SubscriptionsModule],
  providers: [ChargeService],
})
export class ChargeModule {}
