import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  /**
   * vai estar recebendo os dados que o usuario preencheu no front
   * e criar um novo registro no banco de dados
   */
  // mesma face de um middleware do node
  async store(req, res) {
    // usuado para fazer a validação => .object pq o req.body é um objeto
    // shape vai dizer o formato que espera-se que o body tenha
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // vai retornar pro frontend apenas o campos necessários
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  /**
   * só vai ser acessada por usuários que estiverem logados
   * vai editar o usuário (pegando a informação de qual usuário (seu id) do token quue foi usado para logar (realizar a sessao))
   *  */
  async update(req, res) {
    // nenhum deles é obrigatorio, pq nem sempre quero editar todos os campos
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // campo da NOVA senha. Quando o oldPassword for preenchido, quero que o password seja obrigatório
      // campo condicional por causa do .when
      // field se refere ao próprio campo (field = password)
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // field se refere ao próprio campo (field = confirmPassword)
      // confirmPassword deve ser igual ao password
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // caso ele queira, de fato, editar o email (o campo de email está preenchido e não é igual ao cadastrado para esse usuario)
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      // checa pra ver se esse novo email já existe no banco (em todos os registros do banco, pq o email fornecido deve ser unico)
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // checa pra ver se a senha antiga dele bate, de fato, com a senha cadastrada no banco
    // e ele queira alterar a senha
    // (o campo de oldPassword foi preenchido e está correto)
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
