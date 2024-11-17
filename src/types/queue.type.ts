export enum QueueType {
  BlockScanner = 'block-scanner',
  BackfillSync = 'backfill-sync',
  TokenBalancesFetcher = 'token-balances-fetcher',
  InsertActivityLog = 'insert-activity-log',
  InitialCharge = 'initial-charge',
  DailyCharge = 'daily-charge',
  Charge = 'charge',
}

export enum QueueJobType {
  ScanBlock = 'scan-block',
  BackfillSync = 'backfill-sync',
  FetchTokenBalances = 'fetch-token-balances',
  InsertActivityLog = 'insert-activity-log',
  InitialCharge = 'initial-charge',
  DailyCharge = 'daily-charge',
  Charge = 'charge',
}
