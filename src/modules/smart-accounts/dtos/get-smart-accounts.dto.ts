import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetSmartAccountsDto {
  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  owner?: string;
}
