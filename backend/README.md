# NEAR Explorer Backend

## Naming Conventions

-   Use kebab-case to name general modules (put them into `src/` structure)
-   Use camelCase to name variables, constants, functions, and methods
-   Use PascalCase to name classes
-   Use a single underscore in front of a method name to indicate private (non-public) methods

## Run Backend

The simplest way to get started is to use [Indexer for Explorer](https://github.com/near/near-indexer-for-explorer) data.
Conveniently, there are all the basic settings done in `package.json` and `mainnet.env` / `testnet.env` / `shardnet.env` / `guildnet.env`, so you can just run:

```
$ npm run dev:mainnet
```

NOTE: There are also configurations for `testnet`, `shardnet`, and `guildnet`, just change command suffix.

NOTE: To override `mainnet.env` values during local development, create file `mainnet.env.local` and export all the necessary environment variables there

## Run Backend for Production

If you want to build a release bundle and run it:

```
$ npm run build
$ npm run start
```
