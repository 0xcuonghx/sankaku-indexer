import { Module } from '@nestjs/common';
import { BlockScannerService } from './block-scanner.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { RealtimeSyncModule } from '../realtime-sync/realtime-sync.module';
import { BackfillSyncModule } from '../backfill-sync/backfill-sync.module';

@Module({
  imports: [BlockchainClientModule, RealtimeSyncModule, BackfillSyncModule],
  providers: [BlockScannerService],
})
export class BlockScannerModule {}
