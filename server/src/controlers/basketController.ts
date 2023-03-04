import { NextFunction, Response } from 'express';
import AuthRequest from '../utils/authRequest';
import AddDeviceBasket from '../dto/AddDeviceBasket';
import TokenUserData from '../dto/TokenUserDataDto';
import BasketService from '../services/BasketService';
import ErrorHandlerWrap from '../middleware/errorHandlerWrap';
import Validator from '../utils/Validator';
import Logger from '../utils/logger';
const logger = Logger(module);

class BasketController {
    @ErrorHandlerWrap
    async buy(req: AuthRequest, res: Response, next: NextFunction) {
        return res.send('TODO');
    }

    @ErrorHandlerWrap
    async addToBasket(req: AuthRequest, res: Response, next: NextFunction) {
        const deviceDto = new AddDeviceBasket(req.body);
        const user: TokenUserData = req.user;
        const device = await BasketService.addItem(deviceDto, user.id)
        return res.json(device);
    }

    @ErrorHandlerWrap
    async removeFromBasket(req: AuthRequest, res: Response, next: NextFunction) {
        const basketId = Validator.ValidatePositiveNumber(req.body.basketId);
        const user: TokenUserData = req.user;
        const result = await BasketService.removeItem(basketId, user.id);
        return res.json(result);
    }

    async getBasketDevices(req: AuthRequest, res: Response, next: NextFunction) {
        //TODO: add pagination
        const user = req.user;
        const devices = await BasketService.getAllDevices(user.id);
        return res.json(devices);
    }
}

export default new BasketController();