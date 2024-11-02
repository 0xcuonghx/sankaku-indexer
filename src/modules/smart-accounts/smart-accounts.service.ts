import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartAccountsEntity } from './entities/smart-accounts.entity';
import { GetSmartAccountsDto } from './dtos/get-smart-accounts.dto';

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

  async getSmartAccounts(args: GetSmartAccountsDto) {
    const query = this.smartAccountsRepository.createQueryBuilder();

    if (args.owner) {
      query.andWhere('owner = :owner', { owner: args.owner });
    }

    return query.getMany();
  }
}
