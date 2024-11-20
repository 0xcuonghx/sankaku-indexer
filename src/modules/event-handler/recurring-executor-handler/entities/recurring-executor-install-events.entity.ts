import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from '../../types/base-events.entity';

@Entity({ name: 'blockchain_recurring_executor_install_events' })
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
