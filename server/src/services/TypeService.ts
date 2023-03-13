import CreateTypeDto from "../dto/Type/CreateTypeDto";
import CreateTypePropDto from "../dto/Type/CreateTypePropDto";
import EditTypeDto from "../dto/Type/EditTypeDto";
import ApiError from "../error/ApiError";
import DeviceInfoModel from "../models/DeviceInfoModel";
import TypesModel from "../models/TypeModel";
import ImagesManager from "../utils/imagesManager";
import redisFilterWorker from "../utils/RedisFilterWorker";


import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { UploadedFile } from "express-fileupload";


class TypeService {
    async getSuggestions(propName: string): Promise<{ textPart: string, count: number }[]> {
        //TODO: rewrite?
        let result = await DeviceInfoModel.findAll({
            where: { title: propName }, group: ['textPart'],
            attributes: ['textPart', [Sequelize.fn('COUNT', Sequelize.col('textPart')), 'count']]
        });
        return <any>result;
    }

    async getTypeProps(typeId: number) {
        const result = await redisFilterWorker.getFilters(typeId);
        return result;
    }

    async addTypeProp(typePropDto: CreateTypePropDto) {
        //function explain

        //type dto format:
        //title:color
        //values:['blue', 'red', 'white', ...]
        //typeId:0

        //redis save format:
        //'color_red', [devices(ids) 10, 17, 102, 666], 0(typeId)
        //'color_blue', [devices(ids) 11, 23, 188, 626], 0
        //'color_white', [devices(ids) 16, 91, 489, 646], 0

        //TODO: check is such prop exists on other type
        let props = await DeviceInfoModel.findAll({ where: { title: typePropDto.title, textPart: { [Op.in]: typePropDto.values } } });
        let keyDevices = {}; //hash map, 'color_red':[10, 399, 2344...]
        for (const e of typePropDto.values) {
            keyDevices[typePropDto.title + "_" + e] = [];
        }
        props.forEach(prop => {
            keyDevices[prop.title + "_" + prop.textPart].push(prop.deviceId);
        })

        for (const key in keyDevices) {
            await redisFilterWorker.addFilter(typePropDto.typeId, key, keyDevices[key])
        }

        return keyDevices;
    }
    async editType(typeDto: EditTypeDto, img?: UploadedFile) {
        const type = await TypesModel.findByPk(typeDto.typeId);
        if (!type) {
            throw ApiError.badRequest('Such type not exists');
        }

        if (img) {
            const imagesManager = new ImagesManager('types/');
            type.img = await imagesManager.saveFile(img, type.img);

            try {
                type.set(typeDto);
                await type.save();
            } catch (ex) {
                await imagesManager.revert();
                throw ex;
            }
        }
        else {
            type.set(typeDto);
            await type.save();
        }
        return type;
    }

    async getAllTypes() {
        const types = await TypesModel.findAll();
        return types;
    }
    async createType(typeDto: CreateTypeDto, img?) {
        if (img) {
            const imgManager = new ImagesManager('types/');
            typeDto.img = await imgManager.saveFile(img);

            try {
                const type = await TypesModel.create({ ...typeDto });
                return type;
            }
            catch (ex) {
                imgManager.revert();
                throw ex;
            }
        }
        else {
            const type = await TypesModel.create({ ...typeDto });
            return type;
        }

    }
}

export default new TypeService();