import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetTokenBalancesDto {
  @IsOptional()
  @IsEthereumAddress()
  account?: string;

  @IsOptional()
  @IsEthereumAddress()
  token?: string;
}
