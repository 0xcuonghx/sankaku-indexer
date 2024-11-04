import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsInt, IsOptional, Min } from 'class-validator';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsEthereumAddress()
  @ApiProperty({
    required: false,
  })
  account?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    default: 1,
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    default: 10,
  })
  limit?: number = 10;
}
