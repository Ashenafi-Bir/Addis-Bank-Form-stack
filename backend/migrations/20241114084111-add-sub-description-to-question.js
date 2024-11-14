'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'subDescription', {
      type: Sequelize.STRING,
      allowNull: true,  // or false, depending on your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'subDescription');
  }
};
