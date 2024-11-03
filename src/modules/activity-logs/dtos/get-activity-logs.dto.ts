import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional } from 'class-validator';

export class GetActivityLogsDto {
  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  account?: string;
}
