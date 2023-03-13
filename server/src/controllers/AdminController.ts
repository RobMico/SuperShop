import { NextFunction, Request, Response } from "express";
import AdminService from "../services/AdminService";
import Validator from "../utils/Validator";
import ApiError from "../error/ApiError";
import { UploadedFile } from "express-fileupload";
import path from "path";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";


class AdminController {
    @ErrorHandlerWrap
    async downloadLogs(req: Request, res: Response, next: NextFunction) {
        //TODO: rewrite
        let file = path.join(__dirname, '..', 'logs', 'app.log');
        return res.sendFile(file);
    }

    @ErrorHandlerWrap
    async getAllRedisKeys(req: Request, res: Response, next: NextFunction) {
        const data = await AdminService.getAllRedisKeys();
        return res.json(data);
    }

    @ErrorHandlerWrap
    async getRedisStorageMap(req: Request, res: Response, next: NextFunction) {
        const data = await AdminService.getRedisStorageMap();
        return res.json(data);
    }

    @ErrorHandlerWrap
    async clearRedisCache(req: Request, res: Response, next: NextFunction) {
        await AdminService.clearCache();
        return res.json("OK");
    }

    @ErrorHandlerWrap
    async regenerateRedisStorage(req: Request, res: Response, next: NextFunction) {
        //TODO
    }

    // regenerateRStorage: async (req, res, next) => {
    //     let { filters } = req.body;
    //     logger.error("regenerateRStorage; REGENERATING REDIS STORAGE", filters);
    //     try {
    //         filters = JSON.parse(filters);
    //     } catch (ex) { }
    //     try {
    //         let map = await redisFilterWorker.regenerateStorageStructure(filters)
    //         let offset = 0, limit = 100;

    //         //saving ALL filters-devices to redis storage
    //         //query load data like [{dataValues:{val:"title_description", deviceId:"deviceId"}}]
    //         let devices = await DeviceInfo.findAll({
    //             limit: limit, offset: offset, attributes: [
    //                 [sequelize.fn("CONCAT", sequelize.col("title"), '_', sequelize.col("textPart")), "val"],
    //                 "deviceId"
    //             ]
    //         });
    //         do {
    //             offset += devices.length;
    //             await redisFilterWorker.regenerateStorageContent({ map: map, device_props: devices });
    //             devices = await DeviceInfo.findAll({
    //                 limit: limit, offset: offset, attributes: [
    //                     [sequelize.fn("CONCAT", sequelize.col("title"), '_', sequelize.col("textPart")), "val"],
    //                     "deviceId"
    //                 ]
    //             });
    //         } while (devices.length != 0)
    //         //saving ALL types-devices to redis storage
    //         offset = 0;
    //         //format: [{dataValues:{id:"id", typeId:"typeId"}}]
    //         devices = await Device.findAll({ limit: limit, offset: offset, attributes: ["id", "typeId"] });
    //         do {
    //             offset += devices.length;
    //             await redisFilterWorker.regenerateStorageContent({ map: map, device_types: devices });
    //             devices = await Device.findAll({ limit: limit, offset: offset, attributes: ["id", "typeId"] });
    //         } while (devices.length != 0)
    //     } catch (ex) {
    //         logger.error("regenerateRStorage;CRASH", ex);
    //         return next(ApiError.internal("Something was wrong"))
    //     }
    //     return res.send("OK")
    // },

    @ErrorHandlerWrap
    async uploadDevicesJson(req: Request, res: Response, next: NextFunction) {
        if (!req.files || !req.files.data || Array.isArray(req.files.data)) {
            throw ApiError.badRequest('File is not defined');
        }

        const file: UploadedFile = req.files.data;
        let data = JSON.parse(file.data.toString());
        data = Validator.ValidateDevicesArr(data);
        const typeId = Validator.ValidatePositiveNumber(req.body.typeId, 'typeId');
        const result = await AdminService.loadDevicesFromFile(data, typeId);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async getFileHolders(req: Request, res: Response, next: NextFunction) {
        return res.json(process.env.FilesHolders);
    }
}

export default new AdminController();