import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // é chamado automaticamente pelo sequelize
  static init(sequelize) {
    super.init(
      {
        // campos (colunas) que o usuario vai preencher
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          // como esse campo/valor vai ser formatado
          get() {
            return `${process.env.APP_URL}files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
