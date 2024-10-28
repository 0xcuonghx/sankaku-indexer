import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from './base-events.entity';

@Entity({ name: 'recurring_executor_install_events' })
export class RecurringExecutorInstallEventsEntity extends BaseEventsEntity {
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
