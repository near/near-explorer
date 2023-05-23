# NEAR Explorer Frontend

## Run in development

Frontend required running backend to be run in the background to be usable.
Follow the [backend instructions](../backend/README.md) and start frontend like this:

```
$ npm run -w frontend dev
```

## Build & run in production

If you want to build a release bundle and run it:

```
$ npm run -w frontend build
$ npm run -w frontend start
```

## Unit & e2e tests

To run unit tests (using Jest), use the following command:

```
$ npm run -w frontend test
```

To run end-to-end tests (using Playwright) against the local server:

```
$ npm run build
$ npm run test:e2e
```

### Analyzing bundle

To run bundle analyzer:

```
STATS=true OPEN_ANALYZER=true npm -w frontend run build
```
