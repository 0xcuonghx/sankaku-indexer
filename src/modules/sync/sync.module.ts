import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { EventHandlerModule } from '../event-handler/event-handler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from './entities/block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockEntity]),
    BlockchainClientModule,
    EventHandlerModule,
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
