module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.changeColumn(
        "transactions",
        "hash",
        {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true
        },
        { transaction: t }
      );

      await Promise.all([
        queryInterface.addColumn(
          "transactions",
          "args",
          {
            type: Sequelize.JSON,
            defaultValue: {},
            allowNull: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "transactions",
          "parent_hash",
          {
            type: Sequelize.STRING,
            defaultValue: "",
            allowNull: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "transactions",
          "chunk_hash",
          {
            type: Sequelize.STRING,
            defaultValue: "",
            allowNull: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "transactions",
          "status",
          {
            type: Sequelize.STRING,
            defaultValue: "Completed",
            allowNull: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "transactions",
          "logs",
          {
            type: Sequelize.TEXT,
            defaultValue: "",
            allowNull: false
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {}
};
