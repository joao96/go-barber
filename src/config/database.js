require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamp: true, // data de criação/edição de cada registro
    underscored: true, // determinando a nomeclatura de tabelas e colunas para undersocred e caixa baixa
    underscoredAll: true, // determinando a nomeclatura de colunas para undersocred e caixa baixa
  },
};
