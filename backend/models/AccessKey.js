"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccessKey = sequelize.define(
    "AccessKey",
    {
      accountId: {
        field: "account_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      contractId: {
        field: "contract_id",
        type: DataTypes.STRING,
        allowNull: false
      },
      methodName: {
        field: "method_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "access_keys",
      timestamps: false
    }
  );
  AccessKey.associate = function(models) {
    // associations can be defined here
  };
  return AccessKey;
};
