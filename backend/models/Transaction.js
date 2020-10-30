"use strict";
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      hash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true,
      },
      blockHash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
      },
      blockTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      transactionIndex: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      nonce: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      signerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      signerPublicKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "transactions",
      underscored: true,
      timestamps: false,
      indexes: [
        { fields: ["block_hash"] },
        { fields: ["block_timestamp"] },
        { fields: ["signer_id"] },
        { fields: ["receiver_id"] },
        { fields: ["transaction_index"] },
      ],
    }
  );
  Transaction.associate = function (models) {
    // associations can be defined here
  };
  return Transaction;
};
