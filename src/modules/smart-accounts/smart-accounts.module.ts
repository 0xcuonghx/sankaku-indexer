import { Module } from '@nestjs/common';
import { SmartAccountsService } from './smart-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartAccountsEntity } from './entities/smart-accounts.entity';
import { SmartAccountsController } from './smart-accounts-controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmartAccountsEntity])],
  providers: [SmartAccountsService],
  exports: [SmartAccountsService],
  controllers: [SmartAccountsController],
})
export class SmartAccountsModule {}
