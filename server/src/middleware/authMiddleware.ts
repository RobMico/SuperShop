import { NextFunction, Request, Response } from "express";
import AuthRequest from "../utils/authRequest";

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')(module);



export default function(req:AuthRequest, res:Response, next:NextFunction){
    try{
        const [method, token] = req.headers.authorization.split(' ');
        if(method!='Bearer'||!token)
        {
            logger.info("auth check falied");
            return res.status(401).json({message:'User not autorized'});
               
        }
        const decoded =  jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    }catch(ex){  
        logger.info("incorrect token");
        return res.status(401).json({message:'User not autorized'});
    }
}