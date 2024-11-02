import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetSmartAccountsDto {
  @IsOptional()
  @IsEthereumAddress()
  owner?: string;
}
