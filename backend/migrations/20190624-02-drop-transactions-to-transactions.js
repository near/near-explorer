module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions_to_transactions");
  },

  down: (queryInterface, Sequelize) => {}
};
