import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventChannel,
  RecurringExecutorInstalledEvent,
} from 'src/types/internal-event.type';
import { delay } from 'src/utils/helpers';
import { getNetworkSettings } from 'src/utils/settings';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { parseAbi } from 'viem';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ChargeService {
  private readonly logger = new Logger(ChargeService.name);

  constructor(
    private readonly blockchainClientService: BlockchainClientService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @OnEvent(EventChannel.RecurringExecutorInstalled)
  async immediate({ account }: RecurringExecutorInstalledEvent['data']) {
    const subscription =
      await this.subscriptionsService.getSubscription(account);

    if (subscription && subscription.last_execution_timestamp !== 0) {
      // Already charged
      return;
    }

    return this.charge(account);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async dailyChargeAt1AM() {}

  private async charge(account: `0x${string}`, attempts = 1) {
    try {
      this.logger.debug(
        `attempts#${attempts}: Charging subscription for ${account}`,
      );

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

      if (attempts > getNetworkSettings().maxAttempts) {
        this.logger.error(
          `Max attempts try to charge subscription for ${account}`,
        );
        return;
      }

      await delay(getNetworkSettings().retryDelayTime);
      this.charge(account, attempts + 1);
    }
  }
}
