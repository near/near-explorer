"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions_to_blocks", {
      transactionHash: {
        field: "transaction_hash",
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        type: Sequelize.BLOB,
        field: "block_hash",
        allowNull: false,
        primaryKey: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions_to_blocks");
  }
};
