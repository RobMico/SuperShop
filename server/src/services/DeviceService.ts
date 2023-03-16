import db from "../db";
import CreateDeviceDto from "../dto/Device/CreateDeviceDto";
import CreateRateDto from "../dto/Device/CreateRateDto";
import EditDeviceDto from "../dto/Device/EditDeviceDto";
import EditDeviceImagesDto from "../dto/Device/EditDeviceImagesDto";
import GetAllDevicesDto from "../dto/Device/GetAllDevicesDto";
import SelectorDto from "../dto/SelectorDto";
import TokenUserData from "../dto/TokenUserDataDto";
import ApiError from "../error/ApiError";
import CommentsModel from "../models/CommentsModel";
import DeviceInfoModel from "../models/DeviceInfoModel";
import DeviceModel from "../models/DeviceModel";
import RatingModel from "../models/RatingModel";
import ImagesManager from "../utils/imagesManager";
import RedisFilterWorker from "../utils/RedisFilterWorker";

class DeviceService {
    async createRate(createRate: CreateRateDto, user: TokenUserData) {
        //TODO: load current user rate first
        const candidate = await RatingModel.findOne({ where: { userId: user.id, deviceId: createRate.deviceId } });
        if (candidate) {
            throw ApiError.badRequest('You already rated this device');
        }

        await db.transaction(async (t) => {
            const rating = await RatingModel.create({
                comment: createRate.comment,
                rate: createRate.rate,
                deviceId: createRate.deviceId,
                userId: user.id,
                userName: user.email
            },
                { transaction: t });



            await DeviceModel.update(
                {
                    'rate': db.literal(`(rate*ratecount+${rating.rate})/(ratecount+1)`),
                    'ratecount': db.literal('ratecount+1')
                },
                { where: { id: createRate.deviceId }, transaction: t }
            );
            return rating;
        });
    }

    async getRatings(deviceId: number, selector: SelectorDto) {
        //TODO: load current user rate first
        const comments = await RatingModel.findAll({
            where: { deviceId: deviceId },
            limit: selector.limit, offset: selector.offset,
            order: [['id', 'DESC']],//order: sequelize.literal(`"rating"."userId"!='${req.user.id}', "rating"."id" DESC`),
            include: [{ model: CommentsModel, as: 'comments', order: [[CommentsModel, 'id', 'DESC']] }]
        });
        return comments;
    }
    async setAvaliable(deviceId: number, avaliable: boolean) {
        const device = await DeviceModel.update({ avaliable: avaliable }, { where: { id: deviceId } });
        return device;
    }
    async setDisabled(deviceId: number, disabled: boolean) {
        const device = await DeviceModel.update({ disabled: disabled }, { where: { id: deviceId } });
        return device;
    }
    async getDisabled(selector: SelectorDto) {
        const devices = await DeviceModel.findAndCountAll({ where: { disabled: true }, limit: selector.limit, offset: selector.offset });
        return devices;
    }


    async editDevice(editDeviceDto: EditDeviceDto) {
        const device = await DeviceModel.findOne({
            where: { id: editDeviceDto.deviceId },
            include: [{ model: DeviceInfoModel, as: 'info' }]
        });
        if (!device) {
            throw ApiError.badRequest('No such device');
        }
        const result = await db.transaction(async (t) => {
            const typeProps = <string[]>await RedisFilterWorker.getFilters(device.typeId, false);

            device.name = editDeviceDto.name;
            device.price = editDeviceDto.price;
            device.brandId = editDeviceDto.brandId;

            //device.typeId = editDeviceDto.typeId;//TODO

            const promisesArr = [];

            //Save device info to db
            for (const prop of editDeviceDto.info) {
                let prototype = device.info.find(el => el.id == prop.id);
                if (prototype) {//if this property already exists on this device we can remove or edit it
                    if (prop.remove) {//if this prop is marked 'remove'
                        promisesArr.push(prototype.destroy({ transaction: t }));
                    }
                    else {//if it's not marked as "remove", edit
                        prototype.textPart = prop.textPart;
                        prototype.numPart = prop.numPart;
                        prop.edit = prop.title + '_' + prop.textPart;
                        promisesArr.push(prototype.save({ transaction: t }));
                    }
                }
                else {//if it doesn't exist, create
                    prop.deviceId = device.id;
                    prop.id = undefined;
                    promisesArr.push(DeviceInfoModel.create(prop, { transaction: t }));
                }
            }

            promisesArr.push(device.save());
            await Promise.all(promisesArr);

            //save device info to redis
            for (const prop of editDeviceDto.info) {
                const key = prop.title + '_' + prop.textPart;
                if (typeProps.includes(key)) {
                    if (prop.remove) {
                        await RedisFilterWorker.editFilter(key, null, device.id);
                    }
                    else {
                        if (prop.edit && typeProps.includes(prop.edit)) {
                            await RedisFilterWorker.editFilter(prop.edit, key, device.id);
                        }
                        else{
                            await RedisFilterWorker.editFilter(null, key, device.id);
                        }
                    }
                }
            }

            return device;
        });
    }



    async editImages(editImagesDto: EditDeviceImagesDto) {
        const device = await DeviceModel.findOne({ where: { id: editImagesDto.deviceId } });
        if (!device) {
            throw ApiError.badRequest("Such device not exist");
        }


        let curImages = device.img.split(';');

        const imagesManager = new ImagesManager('/devices');
        let removeFiles;

        if (editImagesDto.addLocal) {
            const result = await imagesManager.saveFiles(editImagesDto.addLocal);
            curImages.push(result);
        }
        if (editImagesDto.addExternal) {
            let fileHolders = process.env.FilesHolders.split(';');
            fileHolders.forEach((el, index) => {
                editImagesDto.addExternal = editImagesDto.addExternal.replace(new RegExp(el, 'g'), `%${index}:`);
            });
            curImages.concat(editImagesDto.addExternal.split(';'));
        }


        if (editImagesDto.removeImgs) {
            for (let file of editImagesDto.removeImgs.split(';')) {
                if (file) {
                    let len = curImages.length;
                    curImages = curImages.filter(el => el !== file);
                    if (len == curImages.length) {
                        await imagesManager.revert();
                        throw ApiError.badRequest('Trying to remove unrelated file');
                    }
                    else {
                        if (file.startsWith('%0:')) {
                            ImagesManager.removeFile(file, '/devices');
                        }
                    }
                }
            }
        }

        device.img = curImages.join(';');
        await device.save();

        return device;
    }
    async getOne(deviceId: number, commentLimit: number) {
        const device = await DeviceModel.findOne({
            where: { id: deviceId },
            include: [{ model: DeviceInfoModel, as: 'info' }]//,{model:Rating, as:'rating', limit:CommentLimit}]
        });
        if (!device) {
            throw ApiError.badRequest("Such device not exists");
        }

        return device;
    }
    async getAll(getDevicesDto: GetAllDevicesDto) {
        let result_key;

        if (getDevicesDto.dynamic) {
            let res = await RedisFilterWorker.getIds(getDevicesDto.dynamic, getDevicesDto.result_key, getDevicesDto.typeId)
            if (res) {
                result_key = res.result_key;
                getDevicesDto.deviceIds = res.ids;
            }
        }

        const devices = await DeviceModel.findAndCountAll({
            where: getDevicesDto.getFilters(), limit: getDevicesDto.limit, offset: getDevicesDto.offset, order: getDevicesDto.getOrder()
        });

        return Object.assign(devices, { result_key: result_key });
    }
    async createDevice(deviceDto: CreateDeviceDto, img?) {
        if (img) {
            const imageManager = new ImagesManager('/devices');
            deviceDto.img = await imageManager.saveFiles(img);
            try {
                await db.transaction(async (t) => {
                    const device = await DeviceModel.create(deviceDto, { transaction: t });
                    if (deviceDto.info) {
                        const insertArr = deviceDto.info.map(e => { return { ...e, deviceId: device.id } });
                        await DeviceInfoModel.bulkCreate(insertArr, { transaction: t });
                        await RedisFilterWorker.addDevice(deviceDto.info, device.id, device.typeId);
                    }
                    return device;
                });
            } catch (ex) {
                await imageManager.revert();
                throw ex;
            }
        } else {
            await db.transaction(async (t) => {
                const device = await DeviceModel.create(deviceDto, { transaction: t });
                const insertArr = deviceDto.info.map(e => { return { ...e, deviceId: device.id } });
                await DeviceInfoModel.bulkCreate(insertArr, { transaction: t });
                await RedisFilterWorker.addDevice(deviceDto.info, device.id, device.typeId);
                return device;
            });
        }
    }

}

export default new DeviceService();