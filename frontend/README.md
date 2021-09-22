# NEAR Explorer Frontend

## Project Structure

```
Project Root
├── "configuration-files"
│ 
├── public
│   └── static
│ 
└── src
    ├── components
    │   ├── dash-case-component-group
    │   │   └── PascalCaseComponent.tsx
    │   └── utils
    │       └── PascalCaseComponent.tsx
    │
    ├── libraries
    │   └── kebab-case-module
    │       ├── index.ts
    │       └── kebab-case-module.ts
    │
    └── pages
        └── kebab-case-page-name
            ├── index.tsx
            └── [id].tsx
```

## Naming Conventions

-   Use PascalCase to name React Components (put them into `src/components/` structure), and
    `export default` an unnamed component (function or class)
-   Use kebab-case to name general modules (put them into `src/libraries/` structure)
-   Use kebab-case and [Dynamic Routing rules](https://github.com/zeit/next.js/#dynamic-routing) to
    name the pages (put them into `src/pages/` structure)
-   Use camelCase to name variables, constants, functions, and methods
-   Use PascalCase to name classes
-   Use a single underscore in front of a method name to indicate private (non-public) methods

## Run Frontend for Development

It is useful to have a live-updating dev-server during development, and most of the time you can use the production Explorer backend:

```
$ npm run dev:production-wamp-with-indexer-testnet
```

NOTE: There is also configuration for mainnet, just use `dev:production-wamp-with-indexer-testnet` command.

Or you could run frontend with a local backend.
Follow the [backend instructions](../backend/README.md) and start frontend like this:

```
$ npm run dev:local-wamp-with-indexer-testnet
```

## Run Frontend for Production

If you want to build a release bundle and run it:

```
$ npm run build
$ npm run start
```

Also, there is a common command to run the release bundle against the deployed Explorer backend:

```
$ npm run start:production-wamp-with-indexer-testnet
```

NOTE: There is also configuration for mainnet, just use `start:production-wamp-with-indexer-mainnet` command.

## Run Tests

To run the type check and unit tests, use the following command:

```
$ npm run test
```

TIP: Some tests are snapshot-based, so some changes may require to update the
snapshots; to do that you review the reported diffs and once you are sure that
those changes are legit, run the following command:

```
$ npm run test -- --updateSnapshot
```

, and commit those changes in the snapshots together with your PR.

To run end-to-end testing against the local WAMP router:

```
$ npm run build
$ npm run e2e:test
```

To run cypress testing against testnet:

```
$ npm run build
$ npm run test:ci
```

To run cypress tests:

```
$ cd frontend
$ ./node-modules/.bin/cypress open
```

Then you can choose which tests exactly you want to run.

TIP: Some tests is running with mock data. You can view/add/replace them in `frontend/cypress/fixtures`
