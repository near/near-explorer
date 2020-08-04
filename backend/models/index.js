"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require(__dirname + "/../config/database");
const db = {};

const sequelize = new Sequelize(
  dbConfig.sqlite.database,
  dbConfig.sqlite.username,
  dbConfig.sqlite.password,
  {
    ...dbConfig.sqlite,
    logging: false,
  }
);

const sequelizePostgres = new Sequelize(
  dbConfig.postgres.database,
  dbConfig.postgres.username,
  dbConfig.postgres.password,
  {
    host: dbConfig.postgres.host,
    dialect: dbConfig.postgres.dialect,
    dialectOptions: {
      ssl: true,
    },
  }
);

const sequelizeReadOnly = new Sequelize(
  dbConfig.sqlite.database,
  dbConfig.sqlite.username,
  dbConfig.sqlite.password,
  {
    ...dbConfig.sqlite,
    dialectOptions: {
      ...dbConfig.sqlite.dialectOptions,
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
  if (dbConfig.sqlite.dialect !== "sqlite") {
    console.error(
      `resetDatabase only supports sqlite dialect, but '${dbConfig.sqlite.dialect}' found. No action is taken.`
    );
    return;
  }
  if (saveBackup) {
    fs.renameSync(
      dbConfig.sqlite.storage,
      `${dbConfig.sqlite.storage}.${new Date()
        .toISOString()
        .replace(/:/g, "-")}`
    );
  } else {
    fs.unlinkSync(dbConfig.sqlite.storage);
  }
};

module.exports = db;
