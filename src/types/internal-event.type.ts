export enum EventChannel {
  RecurringExecutorInstalled = 'recurring-executor.installed',
}

export interface RecurringExecutorInstalledEvent {
  channel: EventChannel.RecurringExecutorInstalled;
  data: {
    account: `0x${string}`;
  };
}
