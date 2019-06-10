"use strict";
module.exports = (sequelize, DataTypes) => {
  const TransactionToTransaction = sequelize.define(
    "TransactionToTransaction",
    {
      parentHash: {
        field: "parent_hash",
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      },
      childHash: {
        field: "child_hash",
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      tableName: "transactions_to_transactions",
      timestamps: false
    }
  );
  TransactionToTransaction.associate = function(models) {
    // associations can be defined here
  };
  return TransactionToTransaction;
};
