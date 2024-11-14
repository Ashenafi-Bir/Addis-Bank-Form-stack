// Migration file (generated with --name add-submissionId-to-responses)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Responses', 'submissionId', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Responses', 'submissionId');
  }
};
