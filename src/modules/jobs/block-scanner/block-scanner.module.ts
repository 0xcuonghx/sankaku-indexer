import { Module } from '@nestjs/common';
import { BlockScannerService } from './block-scanner.service';
import { BlockchainClientModule } from '../../blockchain-client/blockchain-client.module';
import { SyncModule } from '../../sync/sync.module';
import { BlockScannerProcessor } from './block-scanner.processor';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from 'src/types/queue.type';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BlockchainClientModule,
    SyncModule,
    BullModule.registerQueue({
      name: QueueType.BlockScanner,
    }),
    BullBoardModule.forFeature({
      name: QueueType.BlockScanner,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [BlockScannerService, BlockScannerProcessor],
})
export class BlockScannerModule {}
