module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.changeColumn(
        "transactions",
        "parent_hash",
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {}
};
