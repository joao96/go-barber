module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // a tabela a qual deve adicionar a coluna
      'avatar_id', // o nome da coluna
      {
        type: Sequelize.INTEGER, // só vai ref o id dela e nao a imagem toda
        references: { model: 'files', key: 'id' }, // FK para a tabela files
        onUpdate: 'CASCADE', // se ele for alterado em 'files', faça a alt aqui
        onDelete: 'SET NULL', // caso o arquivo seja deletado em 'files'
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
