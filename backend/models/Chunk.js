"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chunk = sequelize.define(
    "Chunk",
    {
      hash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        field: "block_hash",
        type: DataTypes.STRING, // base58
        allowNull: false
      },
      shardId: {
        field: "shard_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      authorId: {
        field: "author_id",
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
