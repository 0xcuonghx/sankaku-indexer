import { Module } from '@nestjs/common';
import { BlockchainClientService } from './blockchain-client.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BlockchainClientService],
  exports: [BlockchainClientService],
})
export class BlockchainClientModule {}
