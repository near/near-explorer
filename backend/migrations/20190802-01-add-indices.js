module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addIndex("transactions", {
        fields: ["hash"],
        unique: true,
        transaction
      });

      await queryInterface.addIndex("chunks", {
        fields: ["hash"],
        unique: true,
        transaction
      });

      await queryInterface.addIndex("chunks", {
        fields: ["block_hash"],
        transaction
      });

      await queryInterface.addIndex("blocks", {
        fields: ["hash"],
        unique: true,
        transaction
      });

      await queryInterface.addIndex("blocks", {
        fields: ["height"],
        unique: true,
        transaction
      });
    });
  },

  down: (queryInterface, Sequelize) => {}
};
