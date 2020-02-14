"use strict";
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      hash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
        primaryKey: true
      },
      blockHash: {
        type: DataTypes.STRING, // base58
        allowNull: false
      },
      nonce: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      signerId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      signerPublicKey: {
        type: DataTypes.STRING,
        allowNull: false
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false
      },
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      actions: {
        type: DataTypes.JSON,
        allowNull: false
      },
      txHeight: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      tableName: "transactions",
      underscored: true,
      timestamps: false,
      indexes: [{ fields: ["block_hash"] }]
    }
  );
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};
