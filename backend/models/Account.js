"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      transactionHash: {
        type: DataTypes.STRING, // base58
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "accounts",
      underscored: true,
      timestamps: false,
    }
  );
  Account.associate = function (models) {
    // associations can be defined here
  };
  return Account;
};
