import { Module } from '@nestjs/common';
import { SmartAccountsService } from './smart-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartAccountsEntity } from './entities/smart-accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartAccountsEntity])],
  providers: [SmartAccountsService],
  exports: [SmartAccountsService],
})
export class SmartAccountsModule {}
