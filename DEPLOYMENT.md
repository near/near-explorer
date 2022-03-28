# Deployment

Current deployment process is tightly coupled with `render.com` blueprints.

## `render.com` deployment

### Secrets

Most environment variables are sane, but some of the secrets cannot be published in repository (e.g. database passwords).
To run new deployment, first create environment groups for secrets: `backend/mainnet/secret`, `backend/testnet/secret`, `backend/secret/secret` and add missing environment keys.

For every backend there should be keys:

```
NEAR_READ_ONLY_INDEXER_DATABASE_HOST
NEAR_READ_ONLY_INDEXER_DATABASE_NAME
NEAR_READ_ONLY_INDEXER_DATABASE_USERNAME
NEAR_READ_ONLY_INDEXER_DATABASE_PASSWORD

NEAR_READ_ONLY_ANALYTICS_DATABASE_HOST
NEAR_READ_ONLY_ANALYTICS_DATABASE_NAME
NEAR_READ_ONLY_ANALYTICS_DATABASE_USERNAME
NEAR_READ_ONLY_ANALYTICS_DATABASE_PASSWORD

NEAR_READ_ONLY_TELEMETRY_DATABASE_HOST
NEAR_READ_ONLY_TELEMETRY_DATABASE_NAME
NEAR_READ_ONLY_TELEMETRY_DATABASE_USERNAME
NEAR_READ_ONLY_TELEMETRY_DATABASE_PASSWORD
```

In case backend should expect node telemetry, there should be keys as well:

```
NEAR_WRITE_ONLY_TELEMETRY_DATABASE_HOST
NEAR_WRITE_ONLY_TELEMETRY_DATABASE_NAME
NEAR_WRITE_ONLY_TELEMETRY_DATABASE_USERNAME
NEAR_WRITE_ONLY_TELEMETRY_DATABASE_PASSWORD
```

### Blueprint

The easiset way to deploy Explorer is to create [new blueprint instance](https://dashboard.render.com/select-repo?type=blueprint) in your workspace and select this repository (or your fork, containing `render.yaml`).

## Other hosting options

To deploy Explorer on another hosting platform, please refer to `render.com` [blueprint specification](https://render.com/docs/blueprint-spec) and [actual Explorer blueprint](render.yaml).
