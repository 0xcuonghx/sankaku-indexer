import { ActivityType } from 'src/modules/activity-logs/entities/activity-logs.entity';

export enum EventChannel {
  RecurringExecutorInstalled = 'recurring-executor.installed',
  ActivityLogCreated = 'activity-log.created',
}

export interface RecurringExecutorInstalledEvent {
  channel: EventChannel.RecurringExecutorInstalled;
  data: {
    account: `0x${string}`;
  };
}

export interface ActivityLogCreatedEvent {
  channel: EventChannel.ActivityLogCreated;
  data: {
    account: `0x${string}`;
    type: ActivityType;
    timestamp: number;
    data: Record<string, any>;
  };
}
