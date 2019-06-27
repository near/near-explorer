module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          "nodes",
          "node_id",
          {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([]);
  }
};
