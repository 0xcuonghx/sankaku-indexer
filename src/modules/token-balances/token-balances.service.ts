import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBalancesEntity } from './entities/token-balances.entity';
import { Repository } from 'typeorm';
import { BlockchainClientService } from '../blockchain-client/blockchain-client.service';
import { parseAbi } from 'viem';
import { GetTokenBalancesDto } from './dtos/get-token-balances.dto';

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

  async refetchByAccount(account: `0x${string}`, token: `0x${string}`) {
    try {
      this.logger.debug(`Refetching token balances for ${account}`);
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
      this.logger.error(`Error token balances for ${account}`);
      throw error;
    }
  }

  async getTokenBalances(args: GetTokenBalancesDto) {
    const query = this.tokenBalancesRepository.createQueryBuilder();

    if (args.account) {
      query.andWhere('account = :account', { account: args.account });
    }

    if (args.token) {
      query.andWhere('token = :token', { token: args.token });
    }

    query.skip((args.page - 1) * args.limit).take(args.limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page: args.page,
      limit: args.limit,
      lastPage: Math.ceil(total / args.limit),
    };
  }
}
