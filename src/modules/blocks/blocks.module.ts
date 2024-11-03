import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlocksEntity } from './entities/blocks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlocksEntity])],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
