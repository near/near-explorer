"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("chunks", {
      hash: {
        type: Sequelize.BLOB,
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        field: "block_hash",
        type: Sequelize.BLOB,
        allowNull: false
      },
      shardId: {
        field: "shard_id",
        type: Sequelize.STRING,
        allowNull: false
      },
      authorPk: {
        field: "author_pk",
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("chunks");
  }
};
