import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { SyncService } from '../sync/sync.service';
import { getNetworkSettings } from 'src/utils/settings';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LastSyncBlockEntity } from './entites/last-sync-block.entity';

@Injectable()
export class BlockScannerService {
  private readonly logger = new Logger(BlockScannerService.name);
  private lock = false;

  constructor(
    private readonly blockchainClientService: BlockchainClientService,
    private readonly syncService: SyncService,
    @InjectRepository(LastSyncBlockEntity)
    private lastSyncBlockRepository: Repository<LastSyncBlockEntity>,
  ) {}

  @Cron(`*/${getNetworkSettings().blockScanInterval} * * * * *`)
  async scanBlocks() {
    try {
      if (this.lock) {
        return;
      }
      this.lock = true;
      this.logger.debug(
        `Scanning blocks every ${getNetworkSettings().blockScanInterval} seconds`,
      );

      // We allow syncing of up to `maxBlocks` blocks behind the
      // head of the blockchain. If the indexer lagged behind more
      // than that, then all blocks before that will be sent to the
      // backfill queue.
      const maxBlocks = getNetworkSettings().blocksPerBatch;

      const headBlock = Number(
        await this.blockchainClientService.getBlockNumber(),
      );

      // Fetch the last synced blocked for the current contract type (if it exists)
      let localBlock =
        (await this.lastSyncBlockRepository.findOne({ where: { id: 1 } }))
          .last_synced_block || getNetworkSettings().startBlock + 1;

      if (localBlock >= headBlock) {
        // Nothing to sync
        return;
      }

      const fromBlock = Math.max(localBlock, headBlock - maxBlocks + 1);
      await this.syncService.realtimeSync(fromBlock, headBlock);

      // Queue any remaining blocks for backfilling
      if (localBlock < fromBlock) {
        this.syncService.backfillSync(localBlock, fromBlock - 1);
      }

      // To avoid missing any events, save the latest synced block with a delay.
      // This will ensure that the latest blocks will get queried more than once,
      // which is exactly what we need (since events for the latest blocks might
      // be missing due to upstream chain reorgs):
      // https://ethereum.stackexchange.com/questions/109660/eth-getlogs-and-some-missing-logs
      await this.lastSyncBlockRepository
        .createQueryBuilder()
        .insert()
        .values({ id: 1, last_synced_block: headBlock - 5 })
        .orUpdate(['last_synced_block'], ['id'])
        .execute();

      this.lock = false;
    } catch (error) {
      this.lock = false;
      this.logger.error('Error scanning blocks');
      this.logger.debug(error);
    }
  }
}
