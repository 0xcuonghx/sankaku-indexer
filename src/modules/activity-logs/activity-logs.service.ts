import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { Repository } from 'typeorm';
import { GetActivityLogsDto } from './dtos/get-activity-logs.dto';
import { InsertActivityLogJobData } from '../jobs/insert-activity-log/insert-activity-log.service';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLogsEntity)
    private activityLogsRepository: Repository<ActivityLogsEntity>,
  ) {}

  save(args: InsertActivityLogJobData) {
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
