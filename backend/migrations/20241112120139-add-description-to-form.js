'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Forms', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, // Make description optional (can be null)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Forms', 'description');
  }
};
