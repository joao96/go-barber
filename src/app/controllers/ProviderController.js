import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // vai retornar todos os usuários que são providers
    const providers = await User.findAll({
      // condição de busca
      where: { provider: true },
      // filtra as informações de cada resultado encontrado
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // inclui as informações das tabelas com as quais esses registros possuem
      // relacionamento
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
