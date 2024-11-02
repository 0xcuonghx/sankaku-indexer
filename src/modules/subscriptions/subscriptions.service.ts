import { Injectable, Logger } from '@nestjs/common';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { getNetworkSettings } from 'src/utils/settings';
import { parseAbi } from 'viem';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscriptionBasis,
  SubscriptionReason,
  SubscriptionsEntity,
  SubscriptionStatus,
  SubscriptionType,
} from './entities/subscriptions.entity';
import { Repository, MoreThanOrEqual, LessThan } from 'typeorm';
import { delay } from 'src/utils/helpers';
import moment from 'moment';
import { GetSubscriptionsDto } from './dtos/get-subscriptions.dto';

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
      this.logger.debug(
        `attempts#${attempts}: Refetching subscription for ${account}`,
      );
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
            reason: SubscriptionReason.Unsubscribed,
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

      let nextExecuteTimestamp = 0;
      if (lastExecutionTimestamp != 0) {
        if (basis === 0) {
          nextExecuteTimestamp = moment
            .unix(lastExecutionTimestamp)
            .add(1, 'week')
            .unix();
        } else if (basis === 1) {
          nextExecuteTimestamp = moment
            .unix(lastExecutionTimestamp)
            .add(1, 'month')
            .unix();
        } else if (basis === 2) {
          nextExecuteTimestamp = moment
            .unix(lastExecutionTimestamp)
            .add(6, 'month')
            .unix();
        }
      }

      await this.subscriptionsRepository
        .createQueryBuilder()
        .insert()
        .values({
          account,
          planId: Number(planId),
          last_execution_timestamp: lastExecutionTimestamp,
          next_execution_timestamp: nextExecuteTimestamp,
          basis:
            basis === 0
              ? SubscriptionBasis.Weekly
              : basis === 1
                ? SubscriptionBasis.Monthly
                : SubscriptionBasis.SixMonthly,
          receiver,
          token,
          amount: amount.toString(),
          status: moment(nextExecuteTimestamp).isAfter(moment())
            ? SubscriptionStatus.Active
            : SubscriptionStatus.Inactive,
          type: [1, 2, 3].includes(basis)
            ? SubscriptionType.Plus
            : SubscriptionType.Infinite,
        })
        .orUpdate(
          [
            'planId',
            'last_execution_timestamp',
            'next_execution_timestamp',
            'basis',
            'receiver',
            'token',
            'amount',
            'status',
            'type',
          ],
          ['account'],
        )
        .execute();
    } catch (error) {
      this.logger.debug(error);
      this.logger.error(`Error refetching subscription for ${account}`);

      if (attempts > getNetworkSettings().maxAttempts) {
        this.logger.error(
          `Max attempts try to refetch subscription for ${account}`,
        );
        return;
      }

      await delay(getNetworkSettings().retryDelayTime);
      this.refetchByAccount(account, attempts + 1);
    }
  }

  async getSubscription(account: `0x${string}`) {
    return this.subscriptionsRepository.findOne({ where: { account } });
  }

  async getAccountsToCharge(ranges: [number, number]) {
    const [start, end] = ranges;

    return this.subscriptionsRepository.find({
      where: {
        next_execution_timestamp: MoreThanOrEqual(start) && LessThan(end),
        status: SubscriptionStatus.Active,
      },
    });
  }

  async setSubscriptionStatus(
    account: `0x${string}`,
    status: SubscriptionStatus,
    reason?: SubscriptionReason,
  ) {
    await this.subscriptionsRepository
      .createQueryBuilder()
      .update()
      .set({
        status,
        reason,
      })
      .where('account = :account', { account })
      .execute();
  }

  async getSubscriptions(args: GetSubscriptionsDto) {
    const query = this.subscriptionsRepository.createQueryBuilder();

    if (args.account) {
      query.andWhere('account = :account', { account: args.account });
    }

    return query.getMany();
  }
}
