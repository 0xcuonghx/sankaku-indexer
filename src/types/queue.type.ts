export enum QueueType {
  BlockScanner = 'block-scanner',
  BackfillSync = 'backfill-sync',
  TokenBalancesFetcher = 'token-balances-fetcher',
}

export enum QueueJobType {
  ScanBlock = 'scan-block',
  BackfillSync = 'backfill-sync',
  FetchTokenBalances = 'fetch-token-balances',
}
