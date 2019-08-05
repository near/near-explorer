"use strict";
module.exports = (sequelize, DataTypes) => {
  const Node = sequelize.define(
    "Node",
    {
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      moniker: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nodeId: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true
      },
      lastSeen: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      lastHeight: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      tableName: "nodes",
      underscored: true,
      timestamps: false
    }
  );
  Node.associate = function(models) {
    // associations can be defined here
  };
  return Node;
};
