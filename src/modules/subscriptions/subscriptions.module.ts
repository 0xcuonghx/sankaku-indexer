import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsEntity } from './entities/subscriptions.entity';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [
    BlockchainClientModule,
    TypeOrmModule.forFeature([SubscriptionsEntity]),
  ],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
