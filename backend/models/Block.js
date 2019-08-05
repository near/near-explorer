"use strict";
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define(
    "Block",
    {
      hash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true
      },
      height: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      prevHash: {
        type: DataTypes.STRING, // base58
        allowNull: false
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authorId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      listOfApprovals: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      tableName: "blocks",
      timestamps: false
    }
  );
  Block.associate = function(models) {
    // associations can be defined here
  };
  return Block;
};
