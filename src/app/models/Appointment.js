import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // é chamado automaticamente pelo sequelize
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    /**
     * quando faz-se mais de um relacionamento com a mesma tabela,
     * é OBRIGATÓRIO, dar um apelido para esse relacionamento,
     * caso contrário, o SEQUELIZE se perderia em identificar
     *  */
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
