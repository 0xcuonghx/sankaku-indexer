import { Module } from '@nestjs/common';
import { BlockScannerService } from './block-scanner.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [BlockchainClientModule, SyncModule],
  providers: [BlockScannerService],
})
export class BlockScannerModule {}
