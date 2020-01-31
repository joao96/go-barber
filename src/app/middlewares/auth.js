/**
 * vai fazer uma verificacao para checar se o usuario está logado
 *  */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // vai pegar o token JWT
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // está separado a string 'Bearer ioglufhudsaofhasfu312313' (a segunda parte importa pq é o token)
  const [, token] = authHeader.split(' ');

  try {
    // promisify(jwt.verify) retorna uma função, por isso o segundo parênteses
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // no decoded vao estar as infos que foram usadas na hora de gerar o token (como, por exemplo, o id do usuario)

    req.userId = decoded.id; // coloca a variável dentro do req

    // o next vai garantir que o controller responsavel por essa rota seja chamado em seguida
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
