"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("nodes", {
      ipAddress: {
        field: "ip_address",
        type: Sequelize.STRING,
        allowNull: false
      },
      moniker: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountId: {
        field: "account_id",
        type: Sequelize.STRING,
        allowNull: false
      },
      nodeId: {
        field: "node_id",
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      },
      lastSeen: {
        field: "last_seen",
        type: Sequelize.STRING,
        allowNull: false
      },
      lastHeight: {
        field: "last_height",
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("nodes");
  }
};
