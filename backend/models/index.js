"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const dbConfig = require(__dirname + "/../config/database");

let _exports = {};

const sequelizeTelemetryBackend = dbConfig.writeOnlyTelemetryDatabase.host
  ? new Sequelize(
      dbConfig.writeOnlyTelemetryDatabase.database,
      dbConfig.writeOnlyTelemetryDatabase.username,
      dbConfig.writeOnlyTelemetryDatabase.password,
      dbConfig.writeOnlyTelemetryDatabase
    )
  : null;

const sequelizeTelemetryBackendReadOnly = new Sequelize(
  dbConfig.readOnlyTelemetryDatabase.database,
  dbConfig.readOnlyTelemetryDatabase.username,
  dbConfig.readOnlyTelemetryDatabase.password,
  dbConfig.readOnlyTelemetryDatabase
);

const sequelizeIndexerBackendReadOnly = new Sequelize(
  dbConfig.readOnlyIndexerDatabase.database,
  dbConfig.readOnlyIndexerDatabase.username,
  dbConfig.readOnlyIndexerDatabase.password,
  dbConfig.readOnlyIndexerDatabase
);

const sequelizeAnalyticsBackendReadOnly = new Sequelize(
  dbConfig.readOnlyAnalyticsDatabase.database,
  dbConfig.readOnlyAnalyticsDatabase.username,
  dbConfig.readOnlyAnalyticsDatabase.password,
  dbConfig.readOnlyAnalyticsDatabase
);

if (sequelizeTelemetryBackend) {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      // since sequelize ^v6 we should use this structure
      // https://stackoverflow.com/questions/62917111/sequelize-import-is-not-a-function
      const model = require(path.join(__dirname, file))(
        sequelizeTelemetryBackend,
        Sequelize.DataTypes
      );
      _exports[model.name] = model;
    });
}

Object.keys(_exports).forEach((modelName) => {
  if (_exports[modelName].associate) {
    _exports[modelName].associate(_exports);
  }
});

if (sequelizeTelemetryBackend) {
  _exports.sequelizeTelemetryBackend = sequelizeTelemetryBackend;
}
_exports.sequelizeTelemetryBackendReadOnly = sequelizeTelemetryBackendReadOnly;
_exports.sequelizeIndexerBackendReadOnly = sequelizeIndexerBackendReadOnly;
_exports.sequelizeAnalyticsBackendReadOnly = sequelizeAnalyticsBackendReadOnly;
_exports.Sequelize = Sequelize;

module.exports = _exports;
