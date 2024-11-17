import { plainToInstance } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  POSTGRES_URL: string;

  @IsString()
  RPC_URLS: string;

  @IsString()
  EXECUTOR_PRIVATE_KEY: string;

  @IsString()
  SUPPORTED_CURRENCY_ADDRESSES: string;

  @IsEthereumAddress()
  RECURRING_EXECUTOR_ADDRESS: string;

  @IsNumber()
  BLOCKS_PER_BATCH: number;

  @IsNumber()
  BLOCK_SCAN_INTERVAL: number;

  @IsNumber()
  START_BLOCK: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
