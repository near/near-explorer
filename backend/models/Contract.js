"use strict";
module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    "Contract",
    {
      accountId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transactionHash: {
        type: DataTypes.STRING, // base58
        allowNull: true,
        primaryKey: true
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      tableName: "contracts",
      underscored: true,
      timestamps: false
    }
  );
  Contract.associate = function(models) {
    // associations can be defined here
  };
  return Contract;
};
