"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccessKey = sequelize.define(
    "AccessKey",
    {
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      publicKey: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      accessKeyType: {
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
