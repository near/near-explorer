// NOTE: The fallback names of the env variables are here for backward compatibility only.
// Prefer using the explicit READ_ONLY_*/WRITE_ONLY_* configuration options.
const NEAR_DATABASE_CONFIGS = JSON.parse(process.env.NEAR_DATABASE_CONFIGS);

/*
type NearDatabaseConfig = {
  host: string;
  database: string;
  username: string;
  password?: string;
}

type NearDatabaseConfigs = {
  indexer: NearDatabaseConfig;
  analytics: NearDatabaseConfig;
  telemetry: NearDatabaseConfig;
  writeTelemetry?: NearDatabaseConfig;
}
*/

module.exports = {
  readOnlyIndexerDatabase: {
    dialect: "postgres",
    password: process.env.NEAR_INDEXER_DATABASE_PASSWORD,
    ...NEAR_DATABASE_CONFIGS.indexer,
    logging: false,
  },
  readOnlyAnalyticsDatabase: {
    dialect: "postgres",
    password: process.env.NEAR_ANALYTICS_DATABASE_PASSWORD,
    ...NEAR_DATABASE_CONFIGS.analytics,
    logging: false,
  },
  readOnlyTelemetryDatabase: {
    dialect: "postgres",
    password: process.env.NEAR_TELEMETRY_DATABASE_PASSWORD,
    ...NEAR_DATABASE_CONFIGS.telemetry,
    logging: false,
  },
  writeOnlyTelemetryDatabase: {
    dialect: "postgres",
    password: process.env.NEAR_WRITE_TELEMETRY_DATABASE_PASSWORD,
    ...NEAR_DATABASE_CONFIGS.writeTelemetry,
    logging: false,
    pool: { min: 0, max: 15 },
  },
};
