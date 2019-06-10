"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("blocks", {
      hash: {
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      },
      height: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prevHash: {
        field: "prev_hash",
        type: Sequelize.BLOB,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: false
      },
      authorPk: {
        field: "author_pk",
        type: Sequelize.STRING,
        allowNull: false
      },
      listOfApprovals: {
        field: "list_of_approvals",
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("blocks");
  }
};
