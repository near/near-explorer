import { Kysely, PostgresDialect, PostgresDialectConfig } from "kysely";
import { Pool } from "pg";

import { config } from "@explorer/backend/config";
import * as Analytics from "@explorer/backend/database/models/readOnlyAnalytics";
import * as Indexer from "@explorer/backend/database/models/readOnlyIndexer";
import * as IndexerActivity from "@explorer/backend/database/models/readOnlyIndexerActivity";
import * as Telemetry from "@explorer/backend/database/models/readOnlyTelemetry";

const getPgPool = (postgresConfig: PostgresDialectConfig): Pool => {
  const pool = new Pool(postgresConfig);
  pool.on("error", (error) => {
    // eslint-disable-next-line no-console
    console.error(`Pool ${postgresConfig.database} failed: ${String(error)}`);
  });
  pool.on("connect", (connection) => {
    connection.on("error", (error) =>
      // eslint-disable-next-line no-console
      console.error(
        `Client ${postgresConfig.database} failed: ${String(error)}`
      )
    );
  });
  return pool;
};

const getKysely = <T>(postgresConfig: PostgresDialectConfig): Kysely<T> =>
  new Kysely<T>({
    dialect: new PostgresDialect(getPgPool(postgresConfig)),
  });

export const telemetryWriteDatabase = config.db.writeOnlyTelemetry.host
  ? getKysely<Telemetry.ModelTypeMap>(config.db.writeOnlyTelemetry)
  : null;

export const telemetryDatabase = getKysely<Telemetry.ModelTypeMap>(
  config.db.readOnlyTelemetry
);

export const indexerDatabase = getKysely<Indexer.ModelTypeMap>(
  config.db.readOnlyIndexer
);

export const indexerActivityDatabase = getKysely<IndexerActivity.ModelTypeMap>(
  config.db.readOnlyIndexerActivity
);

export const analyticsDatabase = config.db.readOnlyAnalytics.host
  ? getKysely<Analytics.ModelTypeMap>(config.db.readOnlyAnalytics)
  : null;

export const extraPool = getPgPool(config.db.writeOnlyTelemetry);

export { Indexer, Analytics, Telemetry };
