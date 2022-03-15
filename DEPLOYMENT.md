# Deployment

Current deployment process is tightly coupled with `render.com` blueprints.

## `render.com` deployment

### Secrets

Most environment variables are sane, but some of the secrets cannot be published in repository (e.g. database passwords).
To run new deploment, first create environment groups for secrets: `backend/mainnet/secret`, `backend/testnet/secret`, `backend/secret/secret`.
In current setup groups would contain `NEAR_INDEXER_DATABASE_PASSWORD` / `NEAR_TELEMETRY_DATABASE_PASSWORD` / `NEAR_WRITE_TELEMETRY_DATABASE_PASSWORD` for `mainnet` and `testnet`; `NEAR_TELEMETRY_DATABASE_PASSWORD` / `NEAR_WRITE_TELEMETRY_DATABASE_PASSWORD` for `guildnet`.

### Blueprint

The easiset way to deploy Explorer is to create [new blueprint instance](https://dashboard.render.com/select-repo?type=blueprint) in your workspace and select this repository (or your fork, containing `render.yaml`).

## Other hosting options

To deploy Explorer on another hosting platform, please refer to `render.com` [blueprint specification](https://render.com/docs/blueprint-spec) and [actual Explorer blueprint](render.yaml).
