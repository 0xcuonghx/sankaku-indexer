import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { EventHandlerModule } from '../event-handler/event-handler.module';
import { BlocksModule } from '../blocks/blocks.module';

@Module({
  imports: [BlockchainClientModule, EventHandlerModule, BlocksModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
