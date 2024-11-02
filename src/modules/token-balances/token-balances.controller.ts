import { Controller, Get, Query } from '@nestjs/common';
import { TokenBalancesService } from './token-balances.service';
import { GetTokenBalancesDto } from './dtos/get-token-balances.dto';

@Controller('token-balances')
export class TokenBalancesController {
  constructor(private readonly tokenBalancesService: TokenBalancesService) {}

  @Get()
  async getTokenBalances(@Query() args: GetTokenBalancesDto) {
    return this.tokenBalancesService.getTokenBalances(args);
  }
}
