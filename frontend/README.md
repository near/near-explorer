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

## Run Frontend

It is useful to have a live-updating dev-server during development, so here is the command:

```
$ npm run dev
```

However, you may also need to test it against a deployed version of Explorer backend, in which
case you can use:

```
$ npm run dev:production-wamp
```

If you want to build a release bundle and run it:

```
$ npm run build
$ npm run start
```

Also, there is a common comman to run the release bundle against the deployed Explorer backend:

```
$ npm run start:production-wamp
```

## Run Tests

To run the type check and unit tests, use the following command:

```
$ npm run test
```

To run end-to-end testing against the local WAMP router:

```
$ npm run build
$ npm run e2e:test
```

To run end-to-end testing against testnet:

```
$ npm run test:ci
```
