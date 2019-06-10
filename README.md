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

Initialize database:

```
$ docker-compose exec backend npx sequelize-cli db:migrate --env development-migration
```

Load some dummy data (just for the development):

```
$ docker-compose exec backend node loadDummyData.js
```

Now you can reach the services:

-   http://localhost:3000/ -- frontend
-   ws://localhost:8080/ws -- WAMP router (you don't need it unless you are a developer)
