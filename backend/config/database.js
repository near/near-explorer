module.exports = {
  telemetryDatabase: {
    dialect: "postgres",
    host: process.env.NEAR_TELEMETRY_DATABASE_HOST,
    database: process.env.NEAR_TELEMETRY_DATABASE_NAME,
    username: process.env.NEAR_TELEMETRY_DATABASE_USERNAME,
    password: process.env.NEAR_TELEMETRY_DATABASE_PASSWORD,
  },
  indexerDatabase: {
    dialect: "postgres",
    host: process.env.NEAR_INDEXER_DATABASE_HOST,
    database: process.env.NEAR_INDEXER_DATABASE_NAME,
    username: process.env.NEAR_INDEXER_DATABASE_USERNAME,
    password: process.env.NEAR_INDEXER_DATABASE_PASSWORD,
  },
  analyticsDatabase: {
    dialect: "postgres",
    host: process.env.NEAR_ANALYTICS_DATABASE_HOST,
    database: process.env.NEAR_ANALYTICS_DATABASE_NAME,
    username: process.env.NEAR_ANALYTICS_DATABASE_USERNAME,
    password: process.env.NEAR_ANALYTICS_DATABASE_PASSWORD,
  },
};
