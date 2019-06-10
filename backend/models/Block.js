"use strict";
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define(
    "Block",
    {
      hash: {
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      },
      height: {
        type: DataTypes.STRING,
        allowNull: false
      },
      prevHash: {
        field: "prev_hash",
        type: DataTypes.BLOB,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authorPk: {
        field: "author_pk",
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
