"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chunk = sequelize.define(
    "Chunk",
    {
      hash: {
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        field: "block_hash",
        type: DataTypes.BLOB,
        allowNull: false
      },
      shardId: {
        field: "shard_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      authorPk: {
        field: "author_pk",
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "chunks",
      timestamps: false
    }
  );
  Chunk.associate = function(models) {
    // associations can be defined here
  };
  return Chunk;
};
