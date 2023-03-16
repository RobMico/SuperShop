import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthRequest from '../utils/authRequest';
import logger from '../utils/logger';

export default function(role:string){ 
    return (req:AuthRequest, res:Response, next:NextFunction)=>{
        
        try{
            const [method, token] = req.headers.authorization.split(' ');
            if(method!='Bearer'||!token)
            {
                logger.info("auth check falied")
                res.status(401).json({message:'User not autorized'});
                return;    
            }
            const decoded =  jwt.verify(token, process.env.SECRET_KEY);
            if(decoded.role!=role)
            {
                logger.info("access denied");
                res.status(401).json({message:'Access denied'});
                return;
            }
            req.user = decoded;
            next();
        }catch(ex){
            logger.info("incorrect token");
            res.status(401).json({message:'User not autorized'});
        }
    };

}