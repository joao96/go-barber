module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamp: true, // data de criação/edição de cada registro
    underscored: true, // determinando a nomeclatura de tabelas e colunas para undersocred e caixa baixa
    underscoredAll: true, // determinando a nomeclatura de colunas para undersocred e caixa baixa
  },
};
