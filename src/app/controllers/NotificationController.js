import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    /**
     * checa se o usuario logado é, de fato, um usuário provider
     */
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications.' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({
        // em ordem decrescente
        createdAt: 'desc',
      })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      // o valor para buscar no schema
      req.params.id,
      // o campo que vai mudar
      { read: true },
      // salva no banco, mas sem o new ele n retorna o novo registro ATUALIZADO
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
