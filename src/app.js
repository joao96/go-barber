// onde vamos configurar o servidor express
// utilizar CLASSES neste arquivo para o BACKEND

import express from 'express';
import routes from './routes';

import './database';

class App {
  /**
   * este método será chamado automaticamente no momento que a classe
   * for instanciada
   */
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  /**
   * Onde serão cadastrados todos os middlewares da aplicação
   */
  middlewares() {
    /**
     * prepara a aplicação a receber reqisições no formato JSON
     *  */
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
/**
 * A única coisa que pode ser acessada dessa classe é o server
 */
