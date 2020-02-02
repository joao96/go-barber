// onde vamos configurar o servidor express
// utilizar CLASSES neste arquivo para o BACKEND
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  /**
   * este método será chamado automaticamente no momento que a classe
   * for instanciada
   */
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  /**
   * Onde serão cadastrados todos os middlewares da aplicação
   */
  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    /**
     * prepara a aplicação a receber reqisições no formato JSON
     *  */
    this.server.use(express.json());
    /**
     * .static -> servir arquivos estáticos (imagem, css, html)
     * que podem ser acessados diretamente pelo navegador
     *  */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // middleware de tratamento de exceção (todos os erros que acontecerem na app vao cair aqui)
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
/**
 * A única coisa que pode ser acessada dessa classe é o server
 */
