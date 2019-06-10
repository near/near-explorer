"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      accountId: {
        field: "account_id",
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
        field: "last_block_index",
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
      timestamps: false
    }
  );
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};
