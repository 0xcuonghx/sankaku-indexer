export const getNetworkSettings = () => {
  return {
    supportedCurrencies: {
      ['0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582'.toLowerCase()]: true,
    },
    recurringExecutorAddress:
      '0xaFB64c04e00b9440c6DDfd053248F9974Ff5217B'.toLowerCase(),
    blocksPerBatch: 100,
    blockScanInterval: 15, // seconds
    backfillDelayTime: 60000, // milliseconds
    retryDelayTime: 10000, // milliseconds
    maxAttempts: 5,
    startBlock: 0,
  };
};
