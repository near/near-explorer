import { PoolClient, Pool, PoolConfig } from "pg";
import { databaseConfig } from "../config/database";
import { trimError } from "./utils";

const getPool = (config: PoolConfig): Pool => {
  const pool = new Pool(config);
  pool.on("error", (error) => {
    console.error(`Pool ${config.database} errored: ${trimError(error)}`);
  });
  return pool;
};

const telemetryBackendWriteOnlyPool = databaseConfig.writeOnlyTelemetryDatabase
  .host
  ? getPool(databaseConfig.writeOnlyTelemetryDatabase)
  : null;

const telemetryBackendReadOnlyPool = getPool(
  databaseConfig.readOnlyTelemetryDatabase
);

const indexerBackendReadOnlyPool = getPool(
  databaseConfig.readOnlyIndexerDatabase
);

const analyticsBackendReadOnlyPool = getPool(
  databaseConfig.readOnlyAnalyticsDatabase
);

export const databases = {
  telemetryBackendWriteOnlyPool,
  telemetryBackendReadOnlyPool,
  indexerBackendReadOnlyPool,
  analyticsBackendReadOnlyPool,
};

export const withPool = async <T>(
  backend: Pool,
  run: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await backend.connect();
  const errorHandler = (error: unknown) =>
    console.error(`Client errored: ${trimError(error)}`);
  try {
    client.addListener("error", errorHandler);
    return await run(client);
  } finally {
    if (client) {
      client.removeListener("error", errorHandler);
      client.release();
    }
  }
};
