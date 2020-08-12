const dbPrefix =
  process.env.NEAR_DB_PREFIX ||
  process.env.WAMP_NEAR_NETWORK_NAME ||
  "development";

const dbPassword = process.env.NEAR_NETWORK_INDEXER_EXPLORER_PASSWORD;

module.exports = {
  sqlite: {
    dialect: "sqlite",
    storage: `db/${dbPrefix}-database.sqlite`,
  },
  postgres: {
    username: "readonly",
    password: dbPassword,
    database: "indexer",
    host: "oregon-postgres.render.com",
    dialect: "postgres",
  },
};
