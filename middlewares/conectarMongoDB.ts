import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';

export const conectarMongoDB = (handler : NextApiHandler) => {
   async  (req: NextApiRequest, res: NextApiResponse) => {

        //Verifica se o banco já esta conectado, se estiver seguir para o endpoint ou para o proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
    
        //ja que nao esta conectado, conectar
        //obter a variavel de ambiente preenchida do env
        const {DB_CONEXAO_STRING} = process.env;

        //se a env estiver vazia aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro : 'ENV de configuracao do banco, nao informado'});
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
        mongoose.connection.on('error', () => console.log('Ocorreu erro ao conectar no banco ${}'))
        await mongoose.connect(DB_CONEXAO_STRING);
        
        // agora posso seguir para o endpoint, pois estou conectado no banco
        return handler(req, res);
    }
}