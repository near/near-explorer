# NEAR Blockchain Explorer

[![CI](https://github.com/near/near-explorer/actions/workflows/continuous-integration-workflow.yml/badge.svg?event=push)](https://github.com/near/near-explorer/actions/workflows/continuous-integration-workflow.yml)

## Setup

### Docker-based Setup

Prerequisite:

-   Docker
-   Docker-Compose

Build & run the containers (choose a network):

```
$ npm run docker:up:mainnet
or
$ npm run docker:up:testnet
or
$ npm run docker:up:shardnet
or
$ npm run docker:up:guildnet
```

NOTE: You may want to run them in background, so just add `-- --detach` flag.

Now you can reach the service at http://localhost:3000/

### Node.js Setup (hot reload)

Prerequisite:

-   Node.js (run `nvm use` to switch to the proper version)

Install dependencies:

```
$ npm install
```

Run backend (choose a network):

```
$ npm run -w backend dev:mainnet
or
$ npm run -w backend dev:testnet
or
$ npm run -w backend dev:shardnet
or
$ npm run -w backend dev:guildnet
```

Run frontend in a separate window:

```
$ npm run -w frontend dev
```

Now you can reach the service at http://localhost:3000/

## Contributing

To contribute to NEAR Explorer, please see [CONTRIBUTING](CONTRIBUTING.md).

Most real-time collaboration happens in a variety of channels on the
[NEAR Discord server](https://near.chat), with channels dedicated for getting help, community,
documentation, and all major contribution areas in the NEAR ecosystem. A good place to ask
for help would be the #general channel.

## License

NEAR Explorer is distributed under the terms of both the MIT license and the Apache License (Version 2.0).

See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.
