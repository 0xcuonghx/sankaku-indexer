import { Module } from '@nestjs/common';
import { BlockScannerService } from './block-scanner.service';
import { BlockchainClientModule } from '../blockchain-client/blockchain-client.module';
import { SyncModule } from '../sync/sync.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastSyncBlockEntity } from './entites/last-sync-block.entity';

@Module({
  imports: [
    BlockchainClientModule,
    SyncModule,
    TypeOrmModule.forFeature([LastSyncBlockEntity]),
  ],
  providers: [BlockScannerService],
})
export class BlockScannerModule {}
