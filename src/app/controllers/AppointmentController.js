import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { provider_id, date } = req.body;

    /**
     * checa se o provider_id pertence a, de fato, um usuário provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appoitments with providers.' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId, // vem lá do middleware de autenticação quando o user loga na app
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
