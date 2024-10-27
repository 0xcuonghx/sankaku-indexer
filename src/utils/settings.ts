export const getNetworkSettings = () => {
  return {
    supportedCurrencies: {
      ['0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582'.toLowerCase()]: true,
    },
    blocksPerBatch: 100,
  };
};
