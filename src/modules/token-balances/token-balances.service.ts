import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBalancesEntity } from './entities/token-balances.entity';
import { Repository } from 'typeorm';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { parseAbi } from 'viem';
import { getNetworkSettings } from 'src/utils/settings';
import { delay } from 'src/utils/helpers';

interface TokenBalanceRefetchParams {
  account: `0x${string}`;
  token: `0x${string}`;
}

@Injectable()
export class TokenBalancesService {
  private readonly logger = new Logger(TokenBalancesService.name);
  constructor(
    @InjectRepository(TokenBalancesEntity)
    private tokenBalancesRepository: Repository<TokenBalancesEntity>,
    private readonly blockchainClientService: BlockchainClientService,
  ) {}

  async refetch(params: TokenBalanceRefetchParams[]) {
    // TODO: Using multiple calls
    params.forEach(({ account, token }) => {
      this.refetchByAccount(account, token);
    });
  }

  async refetchByAccount(
    account: `0x${string}`,
    token: `0x${string}`,
    attempts = 1,
  ) {
    try {
      const balance =
        await this.blockchainClientService.publicClient.readContract({
          address: token,
          abi: parseAbi([
            'function balanceOf(address owner) view returns (uint256)',
          ]),
          functionName: 'balanceOf',
          args: [account],
        });

      await this.tokenBalancesRepository
        .createQueryBuilder()
        .insert()
        .values({
          account,
          token,
          balance: balance.toString(),
        })
        .orUpdate(['balance'], ['account', 'token'])
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
      this.refetchByAccount(account, token, attempts + 1);
    }
  }
}