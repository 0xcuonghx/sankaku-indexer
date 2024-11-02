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
  Chain,
} from 'viem';
import { range } from 'lodash';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class BlockchainClientService {
  private client: PublicClient<Transport, Chain>;
  private wallet: WalletClient<Transport, Chain, PrivateKeyAccount>;

  constructor(private readonly configService: ConfigService) {
    const rpcUrls = this.configService.get<string>('RPC_URLS');
    const privateKey = this.configService.get<string>(
      'EXECUTOR_PRIVATE_KEY',
    ) as `0x${string}`;

    const transport = fallback(
      rpcUrls.split(',').map((url) => http(url)),
      {
        rank: true,
      },
    );
    // Using any because of the following error:
    // Type instantiation is excessively deep and possibly infinite.
    // https://github.com/wevm/viem/discussions/1301
    this.client = createPublicClient({
      transport,
    }) as any;

    this.wallet = createWalletClient({
      account: privateKeyToAccount(privateKey),
      transport,
    });
  }

  async getBlockNumber() {
    return this.client.getBlockNumber();
  }

  async getBlocks(fromBlock: number, toBlock: number) {
    return Promise.all(
      range(fromBlock, toBlock + 1).map((blockNumber) =>
        this.client.getBlock({ blockNumber: BigInt(blockNumber) }),
      ),
    );
  }

  get publicClient(): PublicClient<Transport, Chain> {
    return this.client;
  }

  get walletClient(): WalletClient<Transport, Chain, PrivateKeyAccount> {
    return this.wallet;
  }
}
