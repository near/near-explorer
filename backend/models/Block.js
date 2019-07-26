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
        field: "prev_hash",
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
        field: "author_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      listOfApprovals: {
        field: "list_of_approvals",
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "blocks",
      timestamps: false
    }
  );
  Block.associate = function(models) {
    // associations can be defined here
  };
  return Block;
};
