module.exports = {
  // quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      // colunas da tabela files
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  // para fazer o rollback
  down: queryInterface => {
    return queryInterface.dropTable('files');
  },
};
