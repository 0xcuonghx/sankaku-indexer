import { configDotenv } from 'dotenv';

configDotenv();
export const getNetworkSettings = () => {
  const supportedCurrencies = process.env.SUPPORTED_CURRENCY_ADDRESSES.split(
    ',',
  ).reduce((supportedCurrencies, address) => {
    supportedCurrencies[address.toLowerCase()] = true;
    return supportedCurrencies;
  }, {});

  return {
    supportedCurrencies,
    recurringExecutorAddress:
      process.env.RECURRING_EXECUTOR_ADDRESS.toLowerCase(),
    blocksPerBatch: Number(process.env.BLOCKS_PER_BATCH),
    blockScanInterval: Number(process.env.BLOCK_SCAN_INTERVAL),
    retryDelayTime: Number(process.env.RETRY_DELAY_TIME),
    maxRetryAttempts: Number(process.env.MAX_RETRY_ATTEMPTS),
    startBlock: Number(process.env.START_BLOCK),
  };
};
