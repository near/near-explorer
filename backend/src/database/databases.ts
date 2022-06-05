import { Kysely, PostgresDialect, PostgresDialectConfig } from "kysely";
import { Pool } from "pg";
import { config } from "../config";

import * as Indexer from "./models/readOnlyIndexer";
import * as Telemetry from "./models/readOnlyTelemetry";
import * as Analytics from "./models/readOnlyAnalytics";

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

export const indexerTestDatabase = getKysely<{
  balance_changes: {
    block_timestamp: string;
    receipt_id: string | null;
    transaction_hash: string | null;
    affected_account_id: string;
    involved_account_id: string | null;
    direction: "INBOUND" | "OUTBOUND";
    cause: "VALIDATORS_REWARD" | "TRANSACTION" | "CONTRACT_REWARD" | "RECEIPT";
    status: "FAILURE" | "SUCCESS";
    delta_nonstaked_amount: string;
    absolute_nonstaked_amount: string;
    delta_staked_amount: string;
    absolute_staked_amount: string;
    shard_id: number;
    index_in_chunk: number;
  };
}>(config.db.readOnlyIndexerBeta);

export const analyticsDatabase = getKysely<Analytics.ModelTypeMap>(
  config.db.readOnlyAnalytics
);

export const extraPool = getPgPool(config.db.writeOnlyTelemetry);

export { Indexer, Analytics, Telemetry };
