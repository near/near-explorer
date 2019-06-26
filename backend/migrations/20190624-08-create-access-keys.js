"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("access_keys", {
      accountId: {
        field: "account_id",
        type: Sequelize.STRING,
        allowNull: false
      },
      contractId: {
        field: "contract_id",
        type: Sequelize.STRING,
        allowNull: false
      },
      methodName: {
        field: "method_name",
        type: Sequelize.STRING,
        allowNull: true
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("access_keys");
  }
};
