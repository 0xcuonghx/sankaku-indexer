import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActivityLogCreatedEvent,
  EventChannel,
} from 'src/types/internal-event.type';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLogsEntity)
    private activityLogsRepository: Repository<ActivityLogsEntity>,
  ) {}

  @OnEvent(EventChannel.ActivityLogCreated)
  save(args: ActivityLogCreatedEvent['data'][]) {
    return this.activityLogsRepository
      .createQueryBuilder()
      .insert()
      .values(
        args.map((arg) => ({
          account: arg.account,
          type: arg.type,
          timestamp: arg.timestamp,
          data: arg.data,
        })),
      )
      .execute();
  }
}
