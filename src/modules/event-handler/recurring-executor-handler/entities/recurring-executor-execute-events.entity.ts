import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from '../../types/base-events.entity';

@Entity({ name: 'recurring_executor_execute_events' })
export class RecurringExecutorExecuteEventsEntity extends BaseEventsEntity {
  @Column()
  account: string;

  @Column()
  planId: string;

  @Column()
  basis: number;

  @Column()
  receiver: string;

  @Column()
  token: string;

  @Column()
  amount: string;
}
