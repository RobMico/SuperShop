import db from "../db";
import CreateDeviceRawDto from "../dto/Admin/CreateDeviceRawDto";
import ApiError from "../error/ApiError";
import BrandModel from "../models/BrandModel";
import DeviceInfoModel from "../models/DeviceInfoModel";
import DeviceModel from "../models/DeviceModel";
import TypesModel from "../models/TypeModel";
import RedisCacheController from "../utils/RedisCacheController";
import RedisFilterWorker from "../utils/RedisFilterWorker";

class AdminService {
    async loadDevicesFromFile(data: CreateDeviceRawDto[], typeId: number) {
        let _types = await TypesModel.findAll();
        let _brands = await BrandModel.findAll();
        let brandsDict = {};
        let typesDict = {};
        _types.forEach(e => {
            typesDict[e.name] = e.id;
        });
        _brands.forEach(e => {
            brandsDict[e.name] = e.id;
        });

        let fileHolders = process.env.FilesHolders.split(';');


        await db.transaction(async (t) => {
            for (let receivedDevice of data) {
                //Creating device
                if (!brandsDict[receivedDevice.brand]) {
                    throw ApiError.badRequest(`${receivedDevice.brand} brand is not exist`);
                }

                const device = await DeviceModel.create({
                    name: receivedDevice.title,
                    price: receivedDevice.price,
                    brandId: brandsDict[receivedDevice.brand],
                    typeId: typeId,
                    img: receivedDevice.transformImg(fileHolders)
                },
                    { transaction: t });

                //Adding props to device item
                let props = await DeviceInfoModel.bulkCreate(
                    receivedDevice.props.map(obj => {//Formatting props array like [{"deviceId":"id", textPart:"less than 100 symbols", title:"elss than 100 symbols", "numPart":null}]
                        return {
                            deviceId: device.id,
                            textPart: obj.value,
                            title: obj.name,
                            numPart: null
                        }
                    }),
                    { transaction: t });
            }
        });

        return 'ok';
    }
    async clearCache() {
        await RedisCacheController.clearCache();
    }
    async getRedisStorageMap() {
        const data = await RedisFilterWorker.getRedisStorageMap();
        return data;
    }
    async getAllRedisKeys() {
        const keys = await RedisFilterWorker.GetAllKeys();
        return keys;
    }

}

export default new AdminService();