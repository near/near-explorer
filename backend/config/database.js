const dbPrefix =
  process.env.NEAR_DB_PREFIX || process.env.WAMP_NEAR_NETWORK_NAME;

module.exports = {
  development: {
    dialect: "sqlite",
    storage: `db/${dbPrefix || "development"}-database.sqlite`
  },
  test: {
    dialect: "sqlite",
    storage: `db/${dbPrefix || "test"}-database-1ktx10k.sqlite`
  },
  production: {
    dialect: "sqlite",
    storage: `db/${dbPrefix || "production"}-database.sqlite`
  }
};
