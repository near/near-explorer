import { Kysely, PostgresDialect, PostgresDialectConfig } from "kysely";
import { Pool } from "pg";
import { config } from "../config";

import * as Indexer from "./models/readOnlyIndexer";
import * as Telemetry from "./models/readOnlyTelemetry";
import * as Analytics from "./models/readOnlyAnalytics";
import * as IndexerActivity from "./models/readOnlyIndexerActivity";

const getPgPool = (config: PostgresDialectConfig): Pool => {
  const pool = new Pool(config);
  pool.on("error", (error) => {
    console.error(`Pool ${config.database} failed: ${String(error)}`);
  });
  pool.on("connect", (connection) => {
    connection.on("error", (error) =>
      console.error(`Client ${config.database} failed: ${String(error)}`)
    );
  });
  return pool;
};

const getKysely = <T>(config: PostgresDialectConfig): Kysely<T> =>
  new Kysely<T>({
    dialect: new PostgresDialect(getPgPool(config)),
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

export const analyticsDatabase = getKysely<Analytics.ModelTypeMap>(
  config.db.readOnlyAnalytics
);

export const extraPool = getPgPool(config.db.writeOnlyTelemetry);

export { Indexer, Analytics, Telemetry };
