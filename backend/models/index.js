"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require(__dirname + "/../config/database");
const db = {};

const sequelizeLegacySyncBackend = new Sequelize(
  dbConfig.legacySyncDatabase.database,
  dbConfig.legacySyncDatabase.username,
  dbConfig.legacySyncDatabase.password,
  {
    ...dbConfig.legacySyncDatabase,
    logging: false,
  }
);

const sequelizeLegacySyncBackendReadOnly = new Sequelize(
  dbConfig.legacySyncDatabase.database,
  dbConfig.legacySyncDatabase.username,
  dbConfig.legacySyncDatabase.password,
  {
    ...dbConfig.legacySyncDatabase,
    dialectOptions: {
      ...dbConfig.legacySyncDatabase.dialectOptions,
      // Set SQLITE_OPEN_READONLY mode. Read more:
      // * http://www.sqlite.org/c3ref/open.html
      // * http://www.sqlite.org/c3ref/c_open_autoproxy.html
      mode: 1,
    },
    logging: false,
  }
);

const sequelizeIndexerBackendReadOnly = new Sequelize(
  dbConfig.indexerDatabase.database,
  dbConfig.indexerDatabase.username,
  dbConfig.indexerDatabase.password,
  {
    host: dbConfig.indexerDatabase.host,
    dialect: dbConfig.indexerDatabase.dialect,
  }
);

const sequelizeAnalyticsBackendReadOnly = new Sequelize(
  dbConfig.analyticsDatabase.database,
  dbConfig.analyticsDatabase.username,
  dbConfig.analyticsDatabase.password,
  {
    host: dbConfig.analyticsDatabase.host,
    dialect: dbConfig.analyticsDatabase.dialect,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelizeLegacySyncBackend["import"](
      path.join(__dirname, file)
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelizeLegacySyncBackend = sequelizeLegacySyncBackend;
db.sequelizeLegacySyncBackendReadOnly = sequelizeLegacySyncBackendReadOnly;
db.sequelizeIndexerBackendReadOnly = sequelizeIndexerBackendReadOnly;
db.sequelizeAnalyticsBackendReadOnly = sequelizeAnalyticsBackendReadOnly;
db.Sequelize = Sequelize;

db.resetDatabase = function resetDatabase({ saveBackup }) {
  if (dbConfig.legacySyncDatabase.dialect !== "sqlite") {
    console.error(
      `resetDatabase only supports sqlite dialect, but '${dbConfig.legacySyncDatabase.dialect}' found. No action is taken.`
    );
    return;
  }
  if (saveBackup) {
    fs.renameSync(
      dbConfig.legacySyncDatabase.storage,
      `${
        dbConfig.legacySyncDatabase.storage
      }.${new Date().toISOString().replace(/:/g, "-")}`
    );
  } else {
    fs.unlinkSync(dbConfig.legacySyncDatabase.storage);
  }
};

module.exports = db;
