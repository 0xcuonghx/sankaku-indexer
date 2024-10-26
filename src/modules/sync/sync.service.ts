import { Injectable, Logger } from '@nestjs/common';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { getEventInterfaces } from 'src/abis';
import { delay } from 'lodash';
import { MAX_ATTEMPTS } from 'src/utils/constants';

const BLOCKS_PER_BATCH = 1000;
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private readonly blockchainClientService: BlockchainClientService,
  ) {}

  async realtimeSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Realtime syncing from block ${fromBlock} to block ${toBlock}`,
    );
    return this.sync(fromBlock, toBlock);
  }

  async backfillSync(fromBlock: number, toBlock: number) {
    this.logger.debug(
      `Backfill syncing from block ${fromBlock} to block ${toBlock}`,
    );
    // to stop the job from running into issues or taking too long, we dont want to sync a large amount of blocks in one job
    // if the fromBlock & toBlock have a large difference, split the job into smaller jobs
    // if the syncDetails are null, split the job into smaller jobs of 1 block
    // otherwise, split the job into smaller jobs of 1 blocks
    const diff = toBlock - fromBlock;
    const splitSize = BLOCKS_PER_BATCH;

    if (diff > splitSize) {
      const splitJobs = [];
      for (let i = fromBlock; i < toBlock; i += splitSize) {
        splitJobs.push({
          fromBlock: i,
          toBlock: Math.min(i + splitSize - 1, toBlock),
        });
      }

      for (const job of splitJobs) {
        delay(() => this.sync(job.fromBlock, job.toBlock, true), 1000);
      }
      return;
    }

    return this.sync(fromBlock, toBlock, true);
  }

  async sync(
    fromBlock: number,
    toBlock: number,
    backfill: boolean = false,
    attempts = 1,
  ) {
    try {
      this.logger.debug(
        `Syncing from block ${fromBlock} to block ${toBlock} (backfill: ${backfill}, attempts: ${attempts})`,
      );

      const blocks = await this.blockchainClientService.getBlocks(
        fromBlock,
        toBlock,
      );

      if (!blocks) {
        throw new Error(
          `Blocks ${fromBlock} to ${toBlock} not found with RPC provider`,
        );
      }

      const eventAbis = getEventInterfaces().map((iface) => iface.abi);
      const logs = await this.blockchainClientService.publicClient.getLogs({
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
        events: eventAbis,
      });
    } catch (error) {
      this.logger.error(
        `Error syncing from block ${fromBlock} to block ${toBlock} backfill: ${backfill}`,
      );

      if (attempts > MAX_ATTEMPTS) {
        this.logger.error(
          `Max attempts try to sync from block ${fromBlock} to block ${toBlock} backfill: ${backfill}`,
        );
        return;
      }

      this.logger.debug(
        `Retrying sync from block ${fromBlock} to block ${toBlock} backfill: ${backfill}`,
      );
      delay(() => this.sync(fromBlock, toBlock, backfill, attempts + 1), 1000);
    }
  }
}
