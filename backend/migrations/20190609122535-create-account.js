"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("accounts", {
      accountId: {
        field: "account_id",
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      balance: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stake: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastBlockIndex: {
        field: "last_block_index",
        type: Sequelize.STRING,
        allowNull: false
      },
      bytes: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("accounts");
  }
};
