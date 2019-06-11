"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions_to_transactions", {
      parentHash: {
        field: "parent_hash",
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      },
      childHash: {
        field: "child_hash",
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions_to_transactions");
  }
};
