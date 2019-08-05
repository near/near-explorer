"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      balance: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stake: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastBlockIndex: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bytes: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "accounts",
      underscored: true,
      timestamps: false
    }
  );
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};
