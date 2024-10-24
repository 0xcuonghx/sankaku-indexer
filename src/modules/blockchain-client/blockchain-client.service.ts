import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, PublicClient } from 'viem';
import { polygonAmoy } from 'viem/chains';
import _ from 'lodash';

@Injectable()
export class BlockchainClientService {
  private client: PublicClient;
  constructor(private readonly configService: ConfigService) {
    const polygonAmoyRpcUrl = this.configService.get<string>(
      'POLYGON_AMOY_RPC_URL',
    );

    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(polygonAmoyRpcUrl),
    });

    this.client = client as any;
  }

  async getBlockNumber() {
    return this.client.getBlockNumber();
  }

  async getBlocks(fromBlock: number, toBlock: number) {
    return _.range(fromBlock, toBlock + 1).map((blockNumber) =>
      this.client.getBlock({ blockNumber: BigInt(blockNumber) }),
    );
  }
}
