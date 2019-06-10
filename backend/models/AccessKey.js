"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccessKey = sequelize.define(
    "AccessKey",
    {
      pk: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accountPk: {
        field: "account_pk",
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "access_key",
      timestamps: false
    }
  );
  AccessKey.associate = function(models) {
    // associations can be defined here
  };
  return AccessKey;
};
