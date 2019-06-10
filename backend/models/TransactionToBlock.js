"use strict";
module.exports = (sequelize, DataTypes) => {
  const TransactionToBlock = sequelize.define(
    "TransactionToBlock",
    {
      transactionHash: {
        field: "transaction_hash",
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        type: DataTypes.BLOB,
        field: "block_hash",
        allowNull: false,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "transactions_to_blocks",
      timestamps: false
    }
  );
  TransactionToBlock.associate = function(models) {
    // associations can be defined here
  };
  return TransactionToBlock;
};
