import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlocksEntity } from './entities/blocks.entity';
import { Block } from 'viem';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(BlocksEntity)
    private blockRepository: Repository<BlocksEntity>,
  ) {}

  async insert(blocks: Block[]) {
    this.blockRepository
      .createQueryBuilder()
      .insert()
      .values(
        blocks.map((block) => ({
          hash: block.hash,
          block: Number(block.number),
          timestamp: Number(block.timestamp),
        })),
      )
      .orIgnore()
      .execute();
  }

  async getBlockByHash(hash: string) {
    return this.blockRepository.findOne({ where: { hash } });
  }
}
