import { Injectable, Logger } from '@nestjs/common';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { getNetworkSettings } from 'src/utils/settings';
import { parseAbi } from 'viem';
import { forEach } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscriptionBasis,
  SubscriptionsEntity,
  SubscriptionStatus,
} from './entities/subscriptions.entity';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/helpers';
import moment from 'moment';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  constructor(
    @InjectRepository(SubscriptionsEntity)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,
    private readonly blockchainClientService: BlockchainClientService,
  ) {}

  async refetch(accounts: `0x${string}`[]) {
    // TODO: Using multiple calls
    accounts.forEach((account) => {
      this.refetchByAccount(account);
    });
  }

  async refetchByAccount(account: `0x${string}`, attempts = 1) {
    try {
      const [planId, lastExecutionTimestamp] =
        await this.blockchainClientService.publicClient.readContract({
          address: getNetworkSettings()
            .recurringExecutorAddress as `0x${string}`,
          abi: parseAbi([
            'function recurringExecutionOf(address smartAccount) public view returns (uint256, uint32)',
          ]),
          functionName: 'recurringExecutionOf',
          args: [account],
        });

      if (planId === 0n) {
        this.subscriptionsRepository
          .createQueryBuilder()
          .update()
          .set({
            status: SubscriptionStatus.Inactive,
          })
          .where('account = :account', { account })
          .execute();
        return;
      }

      const [basis, receiver, token, amount, _] =
        await this.blockchainClientService.publicClient.readContract({
          address: getNetworkSettings()
            .recurringExecutorAddress as `0x${string}`,
          abi: parseAbi([
            'function recurringExecutionPlanOf(uint256 planId) public view returns (uint8, address, address, uint256, bool)',
          ]),
          functionName: 'recurringExecutionPlanOf',
          args: [planId],
        });

      const nextExecuteTimestamp = moment.unix(lastExecutionTimestamp);
      if (basis === 0) {
        nextExecuteTimestamp.add(1, 'week');
      } else if (basis === 1) {
        nextExecuteTimestamp.add(1, 'month');
      } else if (basis === 2) {
        nextExecuteTimestamp.add(6, 'month');
      }

      await this.subscriptionsRepository
        .createQueryBuilder()
        .insert()
        .values({
          account,
          planId: Number(planId),
          last_execution_timestamp: Number(lastExecutionTimestamp),
          basis:
            basis === 0
              ? SubscriptionBasis.Weekly
              : basis === 1
                ? SubscriptionBasis.Monthly
                : SubscriptionBasis.SixMonthly,
          receiver,
          token,
          amount: amount.toString(),
          status: nextExecuteTimestamp.isAfter(moment())
            ? SubscriptionStatus.Active
            : SubscriptionStatus.Expired,
        })
        .orUpdate(
          [
            'planId',
            'last_execution_timestamp',
            'basis',
            'receiver',
            'token',
            'amount',
            'status',
          ],
          ['account'],
        )
        .execute();
    } catch (error) {
      this.logger.debug(error);
      this.logger.error(`Error refetching subscription for ${account}`, error);

      if (attempts > getNetworkSettings().maxAttempts) {
        this.logger.error(
          `Max attempts try to refetch subscription for ${account}`,
        );
        return;
      }

      this.logger.debug(`Retrying to refetch subscription for ${account}`);
      await delay(getNetworkSettings().retryDelayTime);
      this.refetchByAccount(account, attempts + 1);
    }
  }
}
