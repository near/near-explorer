# NEAR Explorer Frontend

## Project Structure

```
Project Root
├── package.json
├── Dockerfile
│
├── config
│   ├── database.js
│   ├── env-indexer-mainnet
│   └── env-indexer-testnet
│
├── db
│
├── models
│
└── src
    ├── index.js
    ├── config.js
    └── "other-modules"
```

## Naming Conventions

-   Use kebab-case to name general modules (put them into `src/` structure)
-   Use camelCase to name variables, constants, functions, and methods
-   Use PascalCase to name classes
-   Use a single underscore in front of a method name to indicate private (non-public) methods

## Run Backend

The simplest way to get started is to use [Indexer for Explorer](https://github.com/near/near-indexer-for-explorer) data.
Conveniently, there are all the basic settings done in `package.json` and `config/env-indexer-testnet`, so you can just run:

```
$ npm run start:testnet-with-indexer
```

NOTE: There is also configuration for `mainnet`, just use `start:mainnet-with-indexer` command.

Explorer backend exposes all its capabilities though [WAMP-proto](https://wamp-proto.org/), so you will need to run the router, and the simplest way to do that is with Docker Compose:

```
$ docker-compose up -d wamp
```

## Configure Backend

If you maintain your own Indexer for Explorer database or NEAR Archival Node, you can create a local config file `./config/env-indexer-testnet-local` (see `./config/env-indexer-testnet` for details).
Your local config file may look like:

```
export NEAR_RPC_URL=https://archival-rpc.testnet.near.org
export NEAR_INDEXER_DATABASE_HOST=35.184.214.98
export NEAR_INDEXER_DATABASE_NAME=testnet_explorer
export NEAR_INDEXER_DATABASE_USERNAME=public_readonly
export NEAR_INDEXER_DATABASE_PASSWORD=nearprotocol
```

When all preparation is done run backend:

```
$ npm run start:testnet-with-indexer
```

NOTE: There is also configuration for `mainnet`, just apply the same reasoning and use the relevant config file name and command.
