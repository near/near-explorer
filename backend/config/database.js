const dbPrefix =
  process.env.NEAR_DB_PREFIX ||
  process.env.WAMP_NEAR_NETWORK_NAME ||
  "development";

const dbPassword = process.env.NEAR_INDEXER_DATABASE_PASSWORD;
const dbHost = process.env.NEAR_INDEXER_DATABASE_HOST;
const dbName = process.env.NEAR_INDEXER_DATABASE_NAME;
const dbUsername = process.env.NEAR_INDEXER_DATABASE_USERNAME;

module.exports = {
  sqlite: {
    dialect: "sqlite",
    storage: `db/${dbPrefix}-database.sqlite`,
  },
  postgres: {
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: "postgres",
  },
};
