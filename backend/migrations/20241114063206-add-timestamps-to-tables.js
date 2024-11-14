module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Questions');
    if (!tableInfo.createdAt) {
      await queryInterface.addColumn('Questions', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!tableInfo.updatedAt) {
      await queryInterface.addColumn('Questions', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    const formTableInfo = await queryInterface.describeTable('Forms');
    if (!formTableInfo.createdAt) {
      await queryInterface.addColumn('Forms', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!formTableInfo.updatedAt) {
      await queryInterface.addColumn('Forms', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    const responseTableInfo = await queryInterface.describeTable('Responses');
    if (!responseTableInfo.createdAt) {
      await queryInterface.addColumn('Responses', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!responseTableInfo.updatedAt) {
      await queryInterface.addColumn('Responses', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'createdAt');
    await queryInterface.removeColumn('Questions', 'updatedAt');

    await queryInterface.removeColumn('Forms', 'createdAt');
    await queryInterface.removeColumn('Forms', 'updatedAt');

    await queryInterface.removeColumn('Responses', 'createdAt');
    await queryInterface.removeColumn('Responses', 'updatedAt');
  }
};
