import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbiEvent,
  CreateEventFilterReturnType,
  createPublicClient,
  http,
  PublicClient,
  Transport,
} from 'viem';
import { polygonAmoy } from 'viem/chains';
import _ from 'lodash';

@Injectable()
export class BlockchainClientService {
  private readonly polygonAmoyRpcUrl: string;
  private client: PublicClient<Transport, typeof polygonAmoy>;
  constructor(private readonly configService: ConfigService) {
    this.polygonAmoyRpcUrl = this.configService.get<string>(
      'POLYGON_AMOY_RPC_URL',
    );

    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(this.polygonAmoyRpcUrl),
    }) as any;

    this.client = client;
  }

  async getBlockNumber() {
    return this.client.getBlockNumber();
  }

  async getBlocks(fromBlock: number, toBlock: number) {
    return _.range(fromBlock, toBlock + 1).map((blockNumber) =>
      this.client.getBlock({ blockNumber: BigInt(blockNumber) }),
    );
  }

  get publicClient(): PublicClient<Transport, typeof polygonAmoy> {
    return this.client;
  }
}
