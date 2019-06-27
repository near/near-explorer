module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions_to_blocks");
  },

  down: (queryInterface, Sequelize) => {}
};
