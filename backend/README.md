# NEAR Explorer Backend

## Naming Conventions

-   Use kebab-case to name general modules (put them into `src/` structure)
-   Use camelCase to name variables, constants, functions, and methods
-   Use PascalCase to name classes
-   Use a single underscore in front of a method name to indicate private (non-public) methods

## Run Backend

The simplest way to get started is to use [Indexer for Explorer](https://github.com/near/near-indexer-for-explorer) data.
Conveniently, there are all the basic settings done in `package.json` and `testnet.env`, so you can just run:

```
$ npm run dev:testnet
```

NOTE: There is also configuration for `mainnet`, just use `dev:mainnet` command.

NOTE: To override `testnet.env` values during local development, create file `testnet.env.local` and export all the necessary environment variables there

## Configure Backend

If you maintain your own Indexer for Explorer database or NEAR Archival Node, you can create a local config file `.testnet.env.local`.

When all preparation is done run backend:

```
$ npm run dev:testnet
```

NOTE: There is also configuration for `mainnet`, just apply the same reasoning and use the relevant config file name and command.

## Run Backend for Production

If you want to build a release bundle and run it:

```
$ npm run build
$ npm run start
```
