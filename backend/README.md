# NEAR Explorer Backend

## Run in development

The simplest way to get started is to use [Indexer for Explorer](https://github.com/near/near-indexer-for-explorer) data.
Conveniently, there are all the basic settings done in `package.json` and `mainnet.env` / `testnet.env` / `shardnet.env` / `guildnet.env`, so you can just run:

```
$ npm run -w backend dev:mainnet
or
$ npm run -w backend dev:testnet
or
$ npm run -w backend dev:shardnet
or
$ npm run -w backend dev:guildnet
```

NOTE: To override `mainnet.env` values during local development, create file `mainnet.env.local` and export all the necessary environment variables there

## Build & run in production

If you want to build a release bundle and run it:

```
$ npm run -w backend build
$ npm run -w backend start:mainnet
or
$ npm run -w backend start:testnet
or
$ npm run -w backend start:shardnet
or
$ npm run -w backend start:guildnet
```
