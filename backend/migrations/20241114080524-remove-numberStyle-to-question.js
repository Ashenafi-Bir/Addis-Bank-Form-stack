// Migration to remove `questionNumber` field
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'questionNumber');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'questionNumber', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
