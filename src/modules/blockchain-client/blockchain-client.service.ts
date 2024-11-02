import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  createWalletClient,
  fallback,
  http,
  PrivateKeyAccount,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem';
import { polygonAmoy } from 'viem/chains';
import _ from 'lodash';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class BlockchainClientService {
  private client: PublicClient<Transport, typeof polygonAmoy>;
  private wallet: WalletClient<
    Transport,
    typeof polygonAmoy,
    PrivateKeyAccount
  >;

  constructor(private readonly configService: ConfigService) {
    const polygonAmoyRpcUrls = this.configService.get<string>(
      'POLYGON_AMOY_RPC_URLS',
    );
    const privateKey = this.configService.get<string>(
      'EXECUTOR_PRIVATE_KEY',
    ) as `0x${string}`;

    const transport = fallback(
      polygonAmoyRpcUrls.split(',').map((url) => http(url)),
      {
        rank: true,
      },
    );
    // Using any because of the following error:
    // Type instantiation is excessively deep and possibly infinite.
    // https://github.com/wevm/viem/discussions/1301
    this.client = createPublicClient({
      chain: polygonAmoy,
      transport,
    }) as any;

    this.wallet = createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: polygonAmoy,
      transport,
    });
  }

  async getBlockNumber() {
    return this.client.getBlockNumber();
  }

  async getBlocks(fromBlock: number, toBlock: number) {
    return Promise.all(
      _.range(fromBlock, toBlock + 1).map((blockNumber) =>
        this.client.getBlock({ blockNumber: BigInt(blockNumber) }),
      ),
    );
  }

  get publicClient(): PublicClient<Transport, typeof polygonAmoy> {
    return this.client;
  }

  get walletClient(): WalletClient<
    Transport,
    typeof polygonAmoy,
    PrivateKeyAccount
  > {
    return this.wallet;
  }
}
