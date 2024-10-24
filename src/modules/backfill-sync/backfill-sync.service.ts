import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BackfillSyncService {
  private readonly logger = new Logger(BackfillSyncService.name);
  BackfillSyncService;
  async sync(fromBlock: number, toBlock: number) {
    this.logger.debug(`Syncing from block ${fromBlock} to block ${toBlock}`);
  }
}
