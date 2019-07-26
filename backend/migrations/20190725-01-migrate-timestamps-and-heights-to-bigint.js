module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.changeColumn(
        "nodes",
        "last_height",
        {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        { transaction: t }
      );

      await queryInterface.changeColumn(
        "nodes",
        "last_seen",
        {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        { transaction: t }
      );

      await queryInterface.changeColumn(
        "blocks",
        "timestamp",
        {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {}
};
