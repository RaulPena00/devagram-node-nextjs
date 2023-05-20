import type {NextApiRequest, NextApiResponse} from 'next'
import type { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { SeguidorModel } from '@/models/SeguidorModel';
import {politicaCORS} from '../../middlewares/politicaCORS';

const endpointSeguir = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){

            const {userId, id} = req?.query;

            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){

            }
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!id){
                return res.status(400).json({erro : 'Usuario a ser seguido nao encontrado'});
            }
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId : usuarioLogado._id, usuarioASerSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){

                euJaSigoEsseUsuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id: e._id}));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado)
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioASerSeguido)

                return res.status(200).json({'Deixou de seguir o usuario com sucesso'})
            }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                }
                await SeguidorModel.create(seguidor);

                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id, usuarioLogado})


                return res.status(200).json({msg : 'Usuario seguido com sucesso'})
            }
        }

        return res.status(405).json({erro : 'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Não foi possivel seguir/deseguir o usuario informado'});
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguir)));