// const dbPrefix =
//   process.env.NEAR_DB_PREFIX ||
//   process.env.WAMP_NEAR_NETWORK_NAME ||
//   "development";

module.exports = {
  legacySyncDatabase: {
    // dialect: "sqlite",
    // storage: `db/${dbPrefix}-database.sqlite`,
  },
  telemetryDatabase: {
    dialect: "postgres",
    host: process.env.NEAR_INDEXER_DATABASE_HOST,
    database: process.env.NEAR_INDEXER_DATABASE_NAME,
    username: process.env.NEAR_INDEXER_DATABASE_USERNAME,
    password: process.env.NEAR_INDEXER_DATABASE_PASSWORD,
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
