import AddDeviceBasket from "../dto/AddDeviceBasket";
import ApiError from "../error/ApiError";
import BasketModel from "../models/BasketModel";
import DeviceModel from "../models/DeviceModel";

class BasketService {
    async getAllDevices(userId: number) {
        const devices = await BasketModel.findAll({ where: { userId: userId }, include: { model: DeviceModel, as: 'device' } });
        return devices;
    }
    async removeItem(basketId: number, userId: number) {
        const count = await BasketModel.destroy({ where: { userId: userId, id: basketId } });
        if (count === 0) {
            throw ApiError.badRequest('No such device in your basket');
        }
        return count===1;
    }
    async addItem(deviceDto: AddDeviceBasket, userId: number): Promise<BasketModel> {
        const candidate = await BasketModel.findOne({ where: { deviceId: deviceDto.deviceId, userId: userId } });
        if (candidate) {
            throw ApiError.badRequest('Such device already in your basket');
        }
        const result = await BasketModel.create({ deviceId: deviceDto.deviceId, count: deviceDto.deviceCount, userId: userId });
        return result;
    }

}

export default new BasketService();