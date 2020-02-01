// toda a configuração da parte de upload de arquivos
import multer from 'multer';
// para gerar caracteres aleatórios (do proprio node)
import crypto from 'crypto';
/**
 * extname -> retorna a extensão do arquivo e resolve para percorrer um caminho da aplicação
 *  */
import { extname, resolve } from 'path';

export default {
  // como o multer vai guardar o arquivos de imagem
  storage: multer.diskStorage({
    // o destino dos arquivos
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /**
     *  req é a requisição do express mesmo, então tem-se todas as info do body
     * file -> são todos os dados do arquivo que está dando upload (tamanho, tipo, formato, nome)
     *  */
    filename: (req, file, cb) => {
      // como vai formatar o nome de arquivo da imagem
      /** como as pessoas podem dar o mesmo nome para imagens diferentes
       * será colocado um código no início de cada nome para garantir
       * a unicidade
       *  */
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // null -> dizendo que n deu erro
        // hex -> transformando 16 bytes de string aleatória em hexadecimal
        // gfds531das1.png (por exemplo)
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
