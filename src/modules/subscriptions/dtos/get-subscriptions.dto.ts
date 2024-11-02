import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  account?: string;
}
