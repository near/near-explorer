"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const dbConfig = require(__dirname + "/../config/database");
const db = {};

const sequelizeTelemetryBackend = new Sequelize(
  dbConfig.telemetryDatabase.database,
  dbConfig.telemetryDatabase.username,
  dbConfig.telemetryDatabase.password,
  {
    ...dbConfig.telemetryDatabase,
    logging: false,
  }
);

const sequelizeTelemetryBackendReadOnly = new Sequelize(
  dbConfig.telemetryDatabase.database,
  dbConfig.telemetryDatabase.username,
  dbConfig.telemetryDatabase.password,
  {
    ...dbConfig.telemetryDatabase,
    dialectOptions: {
      ...dbConfig.telemetryDatabase.dialectOptions,
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
    const model = sequelizeTelemetryBackend["import"](
      path.join(__dirname, file)
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelizeTelemetryBackend = sequelizeTelemetryBackend;
db.sequelizeTelemetryBackendReadOnly = sequelizeTelemetryBackendReadOnly;
db.sequelizeIndexerBackendReadOnly = sequelizeIndexerBackendReadOnly;
db.sequelizeAnalyticsBackendReadOnly = sequelizeAnalyticsBackendReadOnly;
db.Sequelize = Sequelize;

module.exports = db;
