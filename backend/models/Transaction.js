"use strict";
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      hash: {
        type: DataTypes.BLOB,
        allowNull: false,
        primaryKey: true
      },
      originator: {
        type: DataTypes.STRING,
        allowNull: false
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false
      },
      kind: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "transactions",
      timestamps: false
    }
  );
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};
