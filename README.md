# Sankaku Indexer

## Environment variables

| **Variable**                   | **Description**                                                   | **Example Value**                                                                                  |
|--------------------------------|-------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `PORT`                         | Port on which the application runs.                              | `4001`                                                                                            |
| `POSTGRES_URL`                 | PostgreSQL connection string.                                     | `postgresql://postgres:postgres@localhost:4002/postgres`                                          |
| `REDIS_HOST`                   | Hostname of the Redis server.                                     | `localhost`                                                                                       |
| `REDIS_PORT`                   | Port of the Redis server.                                         | `4003`                                                                                            |
| `REDIS_DB`                     | Redis database index to use.                                      | `0`                                                                                               |
| `RPC_URLS`                     | List of RPC URLs for blockchain interaction.                     | `https://polygon-amoy.g.alchemy.com/v2/...,...`                                                   |
| `EXECUTOR_PRIVATE_KEY`         | Private key for the executor to sign transactions.               | `0x372a14d06020c45cc4ed9ebf10f585efc3537372f71de7804bb9acacefee6463`                              |
| `SUPPORTED_CURRENCY_ADDRESSES` | Address of supported currencies on the blockchain.               | `0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582`                                                      |
| `RECURRING_EXECUTOR_ADDRESS`   | Address of the recurring executor contract.                      | `0xaFB64c04e00b9440c6DDfd053248F9974Ff5217B`                                                      |
| `BLOCKS_PER_BATCH`             | Number of blocks to process per batch during synchronization.    | `1000`                                                                                            |
| `BLOCK_SCAN_INTERVAL`          | Interval (in seconds) between block scans.                       | `2`                                                                                               |
| `START_BLOCK`                  | Starting block number for synchronization.                       | `14530385`                                                                                        |

## Run local

1. Prepare .env file

```
cp .env.example .env
```

2. Run locally

```
docker compose up -d --build
```