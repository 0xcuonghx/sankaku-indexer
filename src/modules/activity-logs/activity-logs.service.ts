import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActivityLogCreatedEvent,
  EventChannel,
} from 'src/types/internal-event.type';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { Repository } from 'typeorm';
import { GetActivityLogsDto } from './dtos/get-activity-logs.dto';

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

  async getActivityLogs(args: GetActivityLogsDto) {
    const query = this.activityLogsRepository.createQueryBuilder();

    if (args.account) {
      query.andWhere('account = :account', { account: args.account });
    }

    query.orderBy('timestamp', 'DESC');

    query.skip((args.page - 1) * args.limit).take(args.limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page: args.page,
      limit: args.limit,
      lastPage: Math.ceil(total / args.limit),
    };
  }
}
