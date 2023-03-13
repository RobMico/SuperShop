import { Request, Response, NextFunction } from 'express';

import AuthRequest from "../utils/authRequest";
import TokenUserData from "../dto/TokenUserDataDto";
import AuthService from "../services/AuthService";
import UserRegistrationDto from "../dto/Auth/UserRegistrationDto";
import UserLoginDto from "../dto/Auth/UserLoginDto";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";

class AuthControler {
    @ErrorHandlerWrap
    async registration(req: Request, res: Response, next: NextFunction) {
        const userDto = new UserRegistrationDto(req.body);
        let token = await AuthService.registration(userDto);
        return res.json({token});
    }
    @ErrorHandlerWrap
    async login(req: Request, res: Response, next: NextFunction) {
        const userDto = new UserLoginDto(req.body);
        let token = await AuthService.login(userDto);
        console.log("JJJJJJJJDD", token);
        return res.json({token});
    }
    @ErrorHandlerWrap
    async checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
        const user: TokenUserData = req.user;
        const token = await AuthService.recreateToken(user);
        return res.json({token});
    }
}


export default new AuthControler();