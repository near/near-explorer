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
        type: DataTypes.STRING, // base58
        allowNull: false
      },
      shardId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authorId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "chunks",
      underscored: true,
      timestamps: false
    }
  );
  Chunk.associate = function(models) {
    // associations can be defined here
  };
  return Chunk;
};
