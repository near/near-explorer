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
    `export default` an unnamed component
-   Use kebab-case to name general modules (put them into `src/libraries/` structure)
-   Use kebab-case and [Dynamic Routing rules](https://github.com/zeit/next.js/#dynamic-routing) to
    name the pages (put them into `src/pages/` structure)
-   Use camelCase to name variables, constants, functions, and methods
-   Use PascalCase to name classes
-   Use a single underscore in front of a method name to indicate private (non-public) methods

## Run Frontend for Development

Frontend required running backend to be run in the background to be usable.
Follow the [backend instructions](../backend/README.md) and start frontend like this:

```
$ npm run dev
```

## Run Frontend for Production

If you want to build a release bundle and run it:

```
$ npm run build
$ npm run start
```

## Run Tests

To run unit tests, use the following command:

```
$ npm run test
```

To run end-to-end testing against the local backend server:

```
$ npm run build
$ npm run test:e2e
```

### Analyzing bundle

To run bundle analyzer:

```
STATS=true OPEN_ANALYZER=true npm -w frontend run build
```
