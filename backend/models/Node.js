"use strict";
module.exports = (sequelize, DataTypes) => {
  const Node = sequelize.define(
    "Node",
    {
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      moniker: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nodeId: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true,
      },
      lastSeen: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      lastHeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      agentName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      agentVersion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      agentBuild: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      peerCount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isValidator: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      lastHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "nodes",
      underscored: true,
      timestamps: false,
    }
  );
  Node.associate = function (models) {
    // associations can be defined here
  };
  return Node;
};
