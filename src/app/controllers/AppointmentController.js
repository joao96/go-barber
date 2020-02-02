import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  // vai listar todos os appointments que o usuário logado possui
  async index(req, res) {
    // page = 1, caso n seja fornecido, está na primeira pagina
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20, // vai listar 20 registros por vez
      offset: (page - 1) * 20, // quantos registros vai pular
      attributes: ['id', 'date', 'past', 'cancelable'], // o id do appointment e a data dele
      include: [
        {
          model: User,
          as: 'provider', // especificando o relacionamento
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

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

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot create appointments with yourself.' });
    }

    /**
     * parseISO: transforma o date em um objeto DATE do javascript
     * startOfHour: vai ignorar os minutos e segundos da hora setada e só contar a Hora
     * (para sempre ter apenas 1 agendamento por hora)
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * checa para datas preenchidas pelo usuário que já passaram
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    /**
     * checa se essa data está disponível
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available.' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId, // vem lá do middleware de autenticação quando o user loga na app
      provider_id,
      // hourStart -> só pega a Hora fornecidade e não os minutos ou segundos
      date: hourStart,
    });

    /**
     * Notificar prestador de serviço
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      // as aspas simples evita do date-fns de mexer no conteudo (texto p/ n formatar)
      // dd -> dia
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      // se ele nao é o dono do agendamento
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }
    // vai remover 2 horas do horario do agendamento
    // só pode fazer cancelamentos 2 horas antes do appointment
    const dateWithSub = subHours(appointment.date, 2);

    // vai checar se essa data já nao passou
    // new Date() -> hora de agora
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      // os dados necessários para executar esse job vai pro handle (data)
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
