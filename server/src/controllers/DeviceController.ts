import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import CreateDeviceDto from "../dto/Device/CreateDeviceDto";
import CreateRateDto from "../dto/Device/CreateRateDto";
import EditDeviceDto from "../dto/Device/EditDeviceDto";
import EditDeviceImagesDto from "../dto/Device/EditDeviceImagesDto";
import GetAllDevicesDto from "../dto/Device/GetAllDevicesDto";
import SelectorDto from "../dto/SelectorDto";
import TokenUserData from "../dto/TokenUserDataDto";
import ErrorHandlerWrap from "../middleware/errorHandlerWrap";
import DeviceService from "../services/DeviceService";
import AuthRequest from "../utils/authRequest";
import Validator from "../utils/Validator";

class DeviceController {
    @ErrorHandlerWrap
    async createDevice(req: Request, res: Response, next: NextFunction) {
        const deviceDto = new CreateDeviceDto(req.body);
        if (req.files && req.files.img && Array.isArray(req.files.img)) {
            const result = await DeviceService.createDevice(deviceDto, req.files.img as UploadedFile[]);
            return res.json(result);
        }
        const result = await DeviceService.createDevice(deviceDto);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async getAll(req: Request, res: Response, next: NextFunction) {
        console.log(req.query)
        console.log(req.body)
        const getDevicesDto = new GetAllDevicesDto(req.query);
        console.log("H1", getDevicesDto);
        const result = await DeviceService.getAll(getDevicesDto);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async getOne(req: Request, res: Response, next: NextFunction) {
        const id = Validator.ValidatePositiveNumber(req.params.id, 'id');
        let commentLimit = 5;
        if (req.query.CommentLimit) {
            commentLimit = Validator.ValidatePositiveNumber(req.query.CommentLimit, 'comment limit');
        }

        const device = await DeviceService.getOne(id, commentLimit);
        return res.json(device);
    }

    @ErrorHandlerWrap
    async editImages(req: Request, res: Response, next: NextFunction) {
        const editImagesDto = new EditDeviceImagesDto(req.body, req.files ? req.files.addImgs : null);
        const result = await DeviceService.editImages(editImagesDto);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async editDevice(req: Request, res: Response, next: NextFunction) {
        const editDeviceDto = new EditDeviceDto(req.body);
        const result = await DeviceService.editDevice(editDeviceDto);
        return res.json(result);
    }

    @ErrorHandlerWrap
    async getDisabled(req: Request, res: Response, next: NextFunction) {
        const selector = new SelectorDto(req.query);
        const devices = await DeviceService.getDisabled(selector);
        return res.json(devices);
    }

    @ErrorHandlerWrap
    async setDisable(req: Request, res: Response, next: NextFunction) {
        const deviceId = Validator.ValidatePositiveNumber(req.body.deviceId);
        const disabled = Validator.ValidateBoolean(req.body.disabled);

        const device = await DeviceService.setDisabled(deviceId, disabled);
        return res.json(device);
    }

    @ErrorHandlerWrap
    async setAvaliable(req: Request, res: Response, next: NextFunction) {
        const deviceId = Validator.ValidatePositiveNumber(req.body.deviceId);
        const avaliable = Validator.ValidateBoolean(req.body.avaliable);

        const device = await DeviceService.setAvaliable(deviceId, avaliable);
        return res.json(device);
    }

    @ErrorHandlerWrap
    async loadRating(req: Request, res: Response, next: NextFunction) {
        const deviceId = Validator.ValidatePositiveNumber(req.query.deviceId);
        const selector = new SelectorDto(req.query);
        const rating = await DeviceService.getRatings(deviceId, selector);
        return res.json(rating);
    }

    @ErrorHandlerWrap
    async postRating(req: AuthRequest, res: Response, next: NextFunction) {
        const createRate = new CreateRateDto(req.body);
        const user:TokenUserData = req.user;
        const result = await DeviceService.createRate(createRate, user);
        return res.json(result);
    }
}

export default new DeviceController();