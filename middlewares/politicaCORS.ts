import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import NextCors from "nextjs-cors";

export const politicaCORS = (handler : NextApiHandler) => async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try{

        await NextCors(req, res, {
            origin : '*',
            methods : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus : 200,
        })


    }catch(e){
        console.log('Erro ao tratar a politica de cors:', e);
        res.status(500).json({erro : 'Ocorreu erro ao tratar a politica de CORS'})
    }



}