// onde ficam todas as rotas

/**
 * não importa o express inteiro só o Router
 * Responsável por cuidar das rotas em arquivo separado
 */
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddlaware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// será um middleware global para, APENAS, as rotas que vierem após essa linha
routes.use(authMiddlaware);

// a rota nao deve ser acessada enquanto o usuario nao estiver autenticado
routes.put('/users', UserController.update);

export default routes;
