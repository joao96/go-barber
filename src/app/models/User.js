import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // é chamado automaticamente pelo sequelize
  static init(sequelize) {
    super.init(
      {
        // campos (colunas) que o usuario vai preencher
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // nunca vai existir na base de dados (só aqui no código)
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    /**
     * hooks -> trechos de codigo que sao executados
     * de forma automatica baseado em açoes que acontecem no model
     * Nesse caso, ANTES DO USUÁRIO (beforeSave) ser editado ou criado no banco, vai executar
     * a função no segundo parâmetro de forma automática
     */
    this.addHook('beforeSave', async user => {
      // só vai ser executado se estiver informando um novo password pro usuario
      if (user.password) {
        // o segundo argumento do bcrypt é a força da criptografia (máximo é 100)
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    // faz o relacionamento entre User e File (o Id da tabela File dentro de User)
    // .hasOne (o Id de User dentro da tabela File)
    // .hasMany (o Id de User dentro de vários registros na tabela File)
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }

  checkPassword(password) {
    // vai comparar a senha que ele tá tentando logar com a senha que está no banco
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
