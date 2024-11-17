import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from 'src/types/queue.type';
import { ChargeJobData } from './charge.service';
import { Logger } from '@nestjs/common';
import { BlockchainClientService } from 'src/modules/blockchain-client/blockchain-client.service';
import { getNetworkSettings } from 'src/config/network.config';
import { parseAbi } from 'viem';

@Processor(QueueType.Charge, {
  concurrency: 1,
})
export class ChargeProcessor extends WorkerHost {
  private readonly logger = new Logger(ChargeProcessor.name);

  constructor(
    private readonly blockchainClientService: BlockchainClientService,
  ) {
    super();
  }

  async process(job: Job<ChargeJobData>) {
    this.logger.debug(
      `Attempts (#${job.attemptsMade}) to process job ${job.name} with data: ${JSON.stringify(job.data)}`,
    );
    const { account } = job.data;
    try {
      const hash =
        await this.blockchainClientService.walletClient.writeContract({
          address: getNetworkSettings()
            .recurringExecutorAddress as `0x${string}`,
          abi: parseAbi(['function execute(address smartAccount) external']),
          functionName: 'execute',
          args: [account],
        } as any);

      await this.blockchainClientService.publicClient.waitForTransactionReceipt(
        { hash },
      );
    } catch (error) {
      this.logger.debug(error);
      this.logger.error(`Error charge subscription for ${account}`);
      throw error;
    }
  }
}
