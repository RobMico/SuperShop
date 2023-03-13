import { NextFunction, Request, Response } from "express";
import AuthRequest from "../utils/authRequest";
import jwt from 'jsonwebtoken';

export default function (req: AuthRequest, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) {
            return next();
        }
        const [method, token] = req.headers.authorization.split(' ');
        if (method != 'Bearer' || !token) {
            return next();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (ex) {
        return next();
    }
}