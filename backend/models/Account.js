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
      accountIndex: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      createdByTransactionHash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
      },
      createdAtBlockTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "accounts",
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ["account_index"] },
        { fields: ["created_at_block_timestamp"] },
      ],
    }
  );
  Account.associate = function (models) {
    // associations can be defined here
  };
  return Account;
};
