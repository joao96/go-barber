/**
 * arquivo responsavel pela conexao com o banco de dados
 * e carregar os models
 *  */

import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  // conexao com o banco e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      // vai checar se o model possui essa função associate
      // se possuir, vai executá-la
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
