// onde vai ser configurado tudo que seja relacionado aos background jobs (fila)
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

/**
 * pegando todos os jobs da aplicação e armazenando dentro de this.queues
 */

class Queue {
  constructor() {
    /**
     * cada tipo de serviço/background job em 2o plano vai ter sua propria fila
     * 1 fila propria para envios de cancelamento de email
     * 1 fila propria para envios de emails para mudança de senha
     */
    this.queues = {};
    this.init();
  }

  init() {
    // key e handle da classe instanciada CancellationMail
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // bee => instância que conecta com o redis
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        // vai tratar da execução do job em background
        handle,
      };
    });
  }

  /**
   * para adicionar novos jobs dentro das filas
   * queue => em qual fila vai adicionar o job (CancellationEmail, por exemplo)
   *  */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * processando as filas e executando os respectivos handles
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      // ouvindo o evento de failed
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
