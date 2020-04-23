"use strict";
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define(
    "Action",
    {
      transactionHash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true,
      },
      actionIndex: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      actionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actionArgs: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "actions",
      underscored: true,
      timestamps: false,
    }
  );
  Action.associate = function (models) {
    // associations can be defined here
  };
  return Action;
};
