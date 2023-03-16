import { NextFunction, Request, Response } from 'express';
import logger from '../utils/dbLogger';


export default (req:Request, res:Response, next:NextFunction) => {
    if (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'] != req.socket.remoteAddress) {
        logger.info('exp;' + req.method + ';' + req.originalUrl, { ip: [req.headers['x-forwarded-for'], req.socket.remoteAddress] });
    } else {
        logger.info('exp;' + req.method + ';' + req.originalUrl, { ip: req.socket.remoteAddress });
    }
    next();
};
