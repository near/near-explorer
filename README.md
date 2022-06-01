# NEAR Blockchain Explorer

In development.

## Setup

### Docker-based Setup

Prerequisite:

-   Docker
-   Docker-Compose

Build Docker images:

```
$ docker-compose build
```

Run them:

```
$ docker-compose up
```

NOTE: You may want to run them in background, so just add `--detach` flag.

Now you can reach the services:

-   http://localhost:3000/ -- frontend server
-   http://localhost:10000/trpc -- backend server (you don't need it unless you are a developer)
-   ws://localhost:10000/ws -- pubsub server (you don't need it unless you are a developer)

## Development Q&A

Q: How to run the local development version of the frontend/backend?

A: It is recommended to use `docker-compose` to run all the services and then stop the one that
you want to develop locally (`docker-compose stop frontend`). (Follow the execution instructions
written in the relevant README file of the subproject)

Q: How to auto-format the source code on commit?

A: Use `npm install` from the root of the project, so it sets up the git hooks which
automatically run `prettier` on every commit. (We wish we don't need to have the root
`package.json`, but [husky](https://github.com/typicode/husky/issues/36) does not support
subpackages nicely)

## Contributing

To contribute to NEAR Explorer, please see [CONTRIBUTING](CONTRIBUTING.md).

Most real-time collaboration happens in a variety of channels on the
[NEAR Discord server](https://near.chat), with channels dedicated for getting help, community,
documentation, and all major contribution areas in the NEAR ecosystem. A good place to ask
for help would be the #general channel.

## License

NEAR Explorer is distributed under the terms of both the MIT license and the Apache License (Version 2.0).

See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.
