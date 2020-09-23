"use strict";
module.exports = (sequelize, DataTypes) => {
  const Genesis = sequelize.define(
    "Genesis",
    {
      genesisTime: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      genesisHeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chainId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "genesis",
      underscored: true,
      timestamps: false,
    }
  );
  Genesis.associate = function (models) {
    // associations can be defined here
  };
  return Genesis;
};
