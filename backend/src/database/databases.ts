import { Kysely, PostgresDialect, PostgresDialectConfig } from "kysely";
import { Pool } from "pg";

import { config } from "@/backend/config";
import * as Analytics from "@/backend/database/models/readOnlyAnalytics";
import * as Indexer from "@/backend/database/models/readOnlyIndexer";
import * as IndexerActivity from "@/backend/database/models/readOnlyIndexerActivity";
import * as Telemetry from "@/backend/database/models/readOnlyTelemetry";
import { getEnvironmentStaticVariables } from "@/common/utils/environment";

import type { DatabaseColumnType } from "./types";

const getPgPool = (postgresConfig: PostgresDialectConfig): Pool => {
  const { environment, revisionId } = getEnvironmentStaticVariables(
    `backend/${config.networkName}`
  );
  const pool = new Pool({
    ...postgresConfig,
    application_name: [process.env.DB_NAME_PREFIX, environment, revisionId]
      .filter(Boolean)
      .join("/"),
  });
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

type TelemetryDatabase = DatabaseColumnType<
  Telemetry.SelectorModelTypeMap,
  Telemetry.InitializerModelTypeMap & Record<string, never>,
  Telemetry.MutatorModelTypeMap & Record<string, never>
>;

export const telemetryWriteDatabase = config.db.writeOnlyTelemetry.host
  ? getKysely<TelemetryDatabase>(config.db.writeOnlyTelemetry)
  : null;

export const telemetryDatabase = getKysely<TelemetryDatabase>(
  config.db.readOnlyTelemetry
);

type IndexerDatabase = DatabaseColumnType<
  Indexer.SelectorModelTypeMap,
  Indexer.InitializerModelTypeMap & Record<string, never>,
  Indexer.MutatorModelTypeMap & Record<string, never>
>;

export const indexerDatabase = getKysely<IndexerDatabase>(
  config.db.readOnlyIndexer
);

type IndexerActivityDatabase = DatabaseColumnType<
  IndexerActivity.SelectorModelTypeMap,
  IndexerActivity.InitializerModelTypeMap & Record<string, never>,
  IndexerActivity.MutatorModelTypeMap & Record<string, never>
>;

export const indexerActivityDatabase = getKysely<IndexerActivityDatabase>(
  config.db.readOnlyIndexerActivity
);

type AnalyticsDatabase = DatabaseColumnType<
  Analytics.SelectorModelTypeMap,
  Analytics.InitializerModelTypeMap & Record<string, never>,
  Analytics.MutatorModelTypeMap & Record<string, never>
>;

export const analyticsDatabase = config.db.readOnlyAnalytics.host
  ? getKysely<AnalyticsDatabase>(config.db.readOnlyAnalytics)
  : null;

export const extraPool = getPgPool(config.db.writeOnlyTelemetry);

export type { Indexer, IndexerDatabase };
