import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RealtimeSyncService {
  private readonly logger = new Logger(RealtimeSyncService.name);

  async sync(fromBlock: number, toBlock: number) {
    this.logger.debug(`Syncing from block ${fromBlock} to block ${toBlock}`);
  }
}
