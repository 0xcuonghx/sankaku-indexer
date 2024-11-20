import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ActivityType {
  WalletCreated = 'wallet_created',
  TokenTransferred = 'token_transferred',
  TokenReceived = 'token_received',
  RecurringExecutionInstalled = 'recurring_execution_installed',
  RecurringExecutionUninstalled = 'recurring_execution_uninstalled',
  RecurringExecutionExecuted = 'recurring_execution_executed',
}

@Entity({ name: 'blockchain_activity_logs' })
export class ActivityLogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column()
  timestamp: number;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;
}
