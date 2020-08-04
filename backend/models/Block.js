"use strict";
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define(
    "Block",
    {
      hash: {
        type: DataTypes.STRING, // base58
        primaryKey: true,
        allowNull: false,
      },
      height: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      prevHash: {
        type: DataTypes.STRING, // base58
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      totalSupply: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gasPrice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
      tableName: "blocks",
      timestamps: false,
      indexes: [{ fields: ["height"] }, { fields: ["timestamp"] }],
    }
  );
  Block.associate = function (models) {
    // associations can be defined here
  };
  return Block;
};
