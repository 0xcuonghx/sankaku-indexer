import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLogsEntity])],
  providers: [ActivityLogsService],
})
export class ActivityLogsModule {}
