module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.changeColumn(
        "blocks",
        "hash",
        {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true
        },
        { transaction: t }
      );
      await queryInterface.changeColumn(
        "blocks",
        "prev_hash",
        {
          type: Sequelize.STRING,
          allowNull: false
        },
        { transaction: t }
      );

      await queryInterface.changeColumn(
        "blocks",
        "height",
        {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        { transaction: t }
      );

      await queryInterface.renameColumn("blocks", "author_pk", "author_id", {
        transaction: t
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([]);
  }
};
