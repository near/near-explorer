import { Kysely, PostgresDialect, PostgresDialectConfig } from "kysely";
import { Pool } from "pg";
import { databaseConfigs } from "./configs";

import * as Indexer from "./models/readOnlyIndexerDatabase";
import * as Telemetry from "./models/readOnlyTelemetryDatabase";
import * as Analytics from "./models/readOnlyAnalyticsDatabase";

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

export const telemetryWriteDatabase = databaseConfigs.writeOnlyTelemetryDatabase
  .host
  ? getKysely<Telemetry.ModelTypeMap>(
      databaseConfigs.writeOnlyTelemetryDatabase
    )
  : null;

export const telemetryDatabase = getKysely<Telemetry.ModelTypeMap>(
  databaseConfigs.readOnlyTelemetryDatabase
);

export const indexerDatabase = getKysely<Indexer.ModelTypeMap>(
  databaseConfigs.readOnlyIndexerDatabase
);

export const analyticsDatabase = getKysely<Analytics.ModelTypeMap>(
  databaseConfigs.readOnlyAnalyticsDatabase
);

export const extraPool = getPgPool(databaseConfigs.writeOnlyTelemetryDatabase);

export { Indexer, Analytics, Telemetry };
