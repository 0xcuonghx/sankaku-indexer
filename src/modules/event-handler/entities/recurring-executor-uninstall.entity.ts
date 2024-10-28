import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from './base-events.entity';

@Entity({ name: 'recurring_executor_uninstall_events' })
export class RecurringExecutorUninstallEventsEntity extends BaseEventsEntity {
  @Column()
  account: string;
}
