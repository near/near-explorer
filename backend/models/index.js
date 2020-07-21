"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database")[env];
const db = {};

const postgresConfig = require(__dirname + "/../config/database")["postgres"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: false,
  }
);

const sequelizePostgres = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  {
    host: postgresConfig.host,
    dialect: postgresConfig.dialect,
    dialectOptions: {
      ssl: true,
    },
  }
);

const sequelizeReadOnly = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialectOptions: {
      ...config.dialectOptions,
      // Set SQLITE_OPEN_READONLY mode. Read more:
      // * http://www.sqlite.org/c3ref/open.html
      // * http://www.sqlite.org/c3ref/c_open_autoproxy.html
      mode: 1,
    },
    logging: false,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.sequelizeReadOnly = sequelizeReadOnly;
db.Sequelize = Sequelize;
db.sequelizePostgres = sequelizePostgres;

db.resetDatabase = function resetDatabase({ saveBackup }) {
  if (config.dialect !== "sqlite") {
    console.error(
      `resetDatabase only supports sqlite dialect, but '${config.dialect}' found. No action is taken.`
    );
    return;
  }
  if (saveBackup) {
    fs.renameSync(
      config.storage,
      `${config.storage}.${new Date().toISOString().replace(/:/g, "-")}`
    );
  } else {
    fs.unlinkSync(config.storage);
  }
};

module.exports = db;
