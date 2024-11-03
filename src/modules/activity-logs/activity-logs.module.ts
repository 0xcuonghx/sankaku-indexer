import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { ActivityLogsController } from './activity-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLogsEntity])],
  providers: [ActivityLogsService],
  controllers: [ActivityLogsController],
})
export class ActivityLogsModule {}
