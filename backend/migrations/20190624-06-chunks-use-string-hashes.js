module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.changeColumn(
        "chunks",
        "hash",
        {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true
        },
        { transaction: t }
      );
      await queryInterface.changeColumn(
        "chunks",
        "block_hash",
        {
          type: Sequelize.STRING,
          allowNull: false
        },
        { transaction: t }
      );

      await queryInterface.renameColumn("chunks", "author_pk", "author_id", {
        transaction: t
      });
    });
  },

  down: (queryInterface, Sequelize) => {}
};
