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
        allowNull: false,
      },
      agentVersion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agentBuild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      peerCount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isValidator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      lastHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "nodes",
      underscored: true,
      timestamps: false,
      indexes: [{ fields: ["last_seen"] }, { fields: ["is_validator"] }],
    }
  );
  Node.associate = function (models) {
    // associations can be defined here
  };
  return Node;
};
