import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartWalletCreateEventsEntity } from './entities/smart-wallet-create-events.entity';
import { FactoryHandlerService } from './factory-handler.service';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { SmartAccountsModule } from 'src/modules/smart-accounts/smart-accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartWalletCreateEventsEntity]),
    BlocksModule,
    SmartAccountsModule,
  ],
  providers: [FactoryHandlerService],
  exports: [FactoryHandlerService],
})
export class FactoryHandlerModule {}
