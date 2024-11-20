import { Column, Entity } from 'typeorm';
import { BaseEventsEntity } from '../../types/base-events.entity';

@Entity({ name: 'blockchain_recurring_executor_uninstall_events' })
export class RecurringExecutorUninstallEventsEntity extends BaseEventsEntity {
  @Column()
  account: string;
}
