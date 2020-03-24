"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccessKey = sequelize.define(
    "AccessKey",
    {
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contractId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      methodName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "access_keys",
      underscored: true,
      timestamps: false,
    }
  );
  AccessKey.associate = function (models) {
    // associations can be defined here
  };
  return AccessKey;
};
