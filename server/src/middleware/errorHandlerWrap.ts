import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import logger from "../utils/logger";
import { BaseError, QueryError, Error } from 'sequelize';

function ErrorHandlerWrap(target: Object, method: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {

        try {
            return await originalMethod.call(this, req, res, next);
        } catch (ex) {
            if (ex instanceof ApiError) {
                logger.info('ApiError', ex);
                return res.status(ex.status).json({ message: ex.message });
            }
            if (ex instanceof BaseError) {
                logger.info('Seqquelize', ex);
                return res.status(400).json({ message: ex.message, type: 'sequelize' });
            }
            logger.error("Unhandled error", ex);
            return res.status(500).json({ message: "Unhandled error" })
        }
    }
}


export default ErrorHandlerWrap;