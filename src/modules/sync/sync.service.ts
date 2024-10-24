import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  async realtimeSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Realtime syncing from block ${fromBlock} to block ${toBlock}`,
    );
  }

  async backfillSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Backfill syncing from block ${fromBlock} to block ${toBlock}`,
    );
  }
}
