import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsEthereumAddress()
  account?: string;
}
