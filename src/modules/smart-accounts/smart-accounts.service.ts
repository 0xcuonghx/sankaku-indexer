import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartAccountsEntity } from './entities/smart-accounts.entity';

interface SmartAccountRefetchParams {
  account: `0x${string}`;
  owner: `0x${string}`;
  salt: string;
}
@Injectable()
export class SmartAccountsService {
  private readonly logger = new Logger(SmartAccountsService.name);
  constructor(
    @InjectRepository(SmartAccountsEntity)
    private smartAccountsRepository: Repository<SmartAccountsEntity>,
  ) {}

  async insert(values: SmartAccountRefetchParams[]) {
    return this.smartAccountsRepository
      .createQueryBuilder()
      .insert()
      .values(values)
      .orIgnore()
      .execute();
  }
}
