"use strict";
module.exports = (sequelize, DataTypes) => {
  const Node = sequelize.define(
    "Node",
    {
      ipAddress: {
        field: "ip_address",
        type: DataTypes.STRING,
        allowNull: false
      },
      moniker: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accountId: {
        field: "account_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      nodeId: {
        field: "node_id",
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true
      },
      lastSeen: {
        field: "last_seen",
        type: DataTypes.STRING,
        allowNull: false
      },
      lastHeight: {
        field: "last_height",
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "nodes",
      timestamps: false
    }
  );
  Node.associate = function(models) {
    // associations can be defined here
  };
  return Node;
};
