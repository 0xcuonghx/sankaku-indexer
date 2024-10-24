import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';

@Module({
  imports: [BlockchainClientModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
