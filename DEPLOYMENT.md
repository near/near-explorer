# Deployment

Current deployment process is tightly coupled with `render.com` blueprints.

## `render.com` deployment

### Secrets

Most environment variables are sane, but some of the secrets cannot be published in repository (e.g. database passwords).
To run new deployment, first create environment groups for secrets: `backend/mainnet/secret`, `backend/testnet/secret`, `backend/guildnet/secret` and add missing environment keys.

For every backend there should be keys:

```
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_INDEXER__HOST
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_INDEXER__DATABASE
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_INDEXER__USER
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_INDEXER__PASSWORD

NEAR_EXPLORER_CONFIG__DB__READ_ONLY_ANALYTICS__HOST
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_ANALYTICS__DATABASE
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_ANALYTICS__USER
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_ANALYTICS__PASSWORD

NEAR_EXPLORER_CONFIG__DB__READ_ONLY_TELEMETRY__HOST
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_TELEMETRY__DATABASE
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_TELEMETRY__USER
NEAR_EXPLORER_CONFIG__DB__READ_ONLY_TELEMETRY__PASSWORD
```

In case backend should expect node telemetry, there should be keys as well:

```
NEAR_EXPLORER_CONFIG__DB__WRITE_ONLY_TELEMETRY__HOST
NEAR_EXPLORER_CONFIG__DB__WRITE_ONLY_TELEMETRY__DATABASE
NEAR_EXPLORER_CONFIG__DB__WRITE_ONLY_TELEMETRY__USER
NEAR_EXPLORER_CONFIG__DB__WRITE_ONLY_TELEMETRY__PASSWORD
```

### Blueprint

The easiset way to deploy Explorer is to create [new blueprint instance](https://dashboard.render.com/select-repo?type=blueprint) in your workspace and select this repository (or your fork, containing `render.yaml`).

## Other hosting options

To deploy Explorer on another hosting platform, please refer to `render.com` [blueprint specification](https://render.com/docs/blueprint-spec) and [actual Explorer blueprint](render.yaml).
