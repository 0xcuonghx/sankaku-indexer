import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { GetActivityLogsDto } from './dtos/get-activity-logs.dto';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  async getActivityLogs(@Query() args: GetActivityLogsDto) {
    return this.activityLogsService.getActivityLogs(args);
  }
}
