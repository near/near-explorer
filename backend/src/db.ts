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

const telemetryBackendPool = databaseConfig.writeOnlyTelemetryDatabase.host
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
  telemetryBackendPool,
  telemetryBackendReadOnlyPool,
  indexerBackendReadOnlyPool,
  analyticsBackendReadOnlyPool,
};

export const withPool = async <T>(
  backend: Pool,
  run: (client: PoolClient) => Promise<T>
): Promise<T> => {
  let client: PoolClient | undefined;
  let result: T;
  const errorHandler = (error: unknown) =>
    console.error(`Client errored: ${trimError(error)}`);
  try {
    client = await backend.connect();
    client.addListener("error", errorHandler);
    result = await run(client);
    client.release();
    return result;
  } catch (e) {
    if (client) {
      client.removeListener("error", errorHandler);
      client.release();
    }
    throw e;
  }
};
