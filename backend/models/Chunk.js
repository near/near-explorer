"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chunk = sequelize.define(
    "Chunk",
    {
      blockHash: {
        type: DataTypes.STRING, // base58
        primaryKey: true,
        allowNull: false,
      },
      shardId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gasLimit: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      gasUsed: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      heightCreated: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      heightIncluded: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "chunks",
      underscored: true,
      timestamps: false,
    }
  );
  Chunk.associate = function (models) {
    // associations can be defined here
  };
  return Chunk;
};
