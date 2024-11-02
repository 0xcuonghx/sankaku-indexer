import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetTokenBalancesDto {
  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  account?: string;

  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  token?: string;
}
