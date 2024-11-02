import { Controller, Get, Param, Query } from '@nestjs/common';
import { SmartAccountsService } from './smart-accounts.service';
import { GetSmartAccountsDto } from './dtos/get-smart-accounts.dto';

@Controller('smart-accounts')
export class SmartAccountsController {
  constructor(private readonly smartAccountsService: SmartAccountsService) {}

  @Get()
  async getSmartAccounts(@Query() args: GetSmartAccountsDto) {
    return this.smartAccountsService.getSmartAccounts(args);
  }
}
