// A fila vai rodar em um 'node' separado! (diferente do da aplicação em si)
// a fila deve estar desaclopada (n vai influenciar na performance da aplicação )
import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();
