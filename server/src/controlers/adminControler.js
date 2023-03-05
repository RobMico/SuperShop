const ApiError = require('../error/ApiError');
const logger = require('../utils/logger')(module);
const fs = require("fs");
var path = require('path');
const redisCacheControl = require('../utils/redisCacheControl');
const redisFilterWorker = require('../utils/RedisFilterWorker');
const { Device, DeviceInfo, Rating, Comment, sequelize, Op, Type, Brand } = require('../models/models');
const fileWorker = require('../utils/fileWorker');

var adminControler = {
    downloadLogs: async (req, res, next) => {
        logger.warning("downloadLogs;logs downloaded");
        try {
            let file = path.join(__dirname, '..', 'logs', 'app.log')
            return res.sendFile(file);
        } catch (ex) {
            logger.error("downloadLogs; CRASH", ex)
            return next(ApiError.internal("Something was wrong"));
        }
    },
    getRKeys: async (req, res, next) => {
        logger.warning("getRKeys;")
        try {
            const data = await redisCacheControl.getAllKeys();
            return res.json(data);
        } catch (ex) {
            logger.error("getRKeys; CRASH", ex);
            return next(ApiError.internal("Something was wrong"));
        }

    },
    getRTypes: async (req, res, next) => {
        logger.warning("getRTypes;")
        try {
            let data = await redisFilterWorker.getRedisTypes();
            return res.json(data);
        } catch (ex) {
            logger.error("getRTypes; CRASH", ex)
            return next(ApiError.internal("Something was wrong"));
        }
    },
    clearRCache: async (req, res, next) => {
        logger.warning("clearRCache;")
        try {
            redisCacheControl.removeCache();
        } catch (ex) {
            logger.error("clearRCache; CRASH", ex)
            return next(ApiError.internal("Something was wrong"));
        }
        return res.send("OK")
    },
    regenerateRStorage: async (req, res, next) => {
        let { filters } = req.body;
        logger.error("regenerateRStorage; REGENERATING REDIS STORAGE", filters);
        try {
            filters = JSON.parse(filters);
        } catch (ex) { }
        try {
            let map = await redisFilterWorker.regenerateStorageStructure(filters)
            let offset = 0, limit = 100;

            //saving ALL filters-devices to redis storage
            //query load data like [{dataValues:{val:"title_description", deviceId:"deviceId"}}]
            let devices = await DeviceInfo.findAll({
                limit: limit, offset: offset, attributes: [
                    [sequelize.fn("CONCAT", sequelize.col("title"), '_', sequelize.col("textPart")), "val"],
                    "deviceId"
                ]
            });
            do {
                offset += devices.length;
                await redisFilterWorker.regenerateStorageContent({ map: map, device_props: devices });
                devices = await DeviceInfo.findAll({
                    limit: limit, offset: offset, attributes: [
                        [sequelize.fn("CONCAT", sequelize.col("title"), '_', sequelize.col("textPart")), "val"],
                        "deviceId"
                    ]
                });
            } while (devices.length != 0)
            //saving ALL types-devices to redis storage
            offset = 0;
            //format: [{dataValues:{id:"id", typeId:"typeId"}}]
            devices = await Device.findAll({ limit: limit, offset: offset, attributes: ["id", "typeId"] });
            do {
                offset += devices.length;
                await redisFilterWorker.regenerateStorageContent({ map: map, device_types: devices });
                devices = await Device.findAll({ limit: limit, offset: offset, attributes: ["id", "typeId"] });
            } while (devices.length != 0)
        } catch (ex) {
            logger.error("regenerateRStorage;CRASH", ex);
            return next(ApiError.internal("Something was wrong"))
        }
        return res.send("OK")
    },
    uploadJSON: async (req, res, next) => {
        logger.error("uploadJSON;")
        try {
            const file = req.files.data;
            const { typeId } = req.body;
            let data;
            try {
                if (file) {
                    data = JSON.parse(file.data);
                }
                else {
                    return next(ApiErrors.badRequest("NO FILE"));
                }
            } catch (ex) {
                logger.error("uploadJSON; Parsing file error", ex)
                return next(ApiError.internal("Parsing file error"));
            }
            let _types = await Type.findAll();
            let _brands = await Brand.findAll();
            let brands = {};
            let types = {};
            _types.forEach(e => {
                types[e.name] = e.id;
            });
            _brands.forEach(e => {
                brands[e.name] = e.id;
            });

            let __holders = process.env.FilesHolders.split(';');
            const result = await sequelize.transaction(async (t) => {
                for (let el of data) {
                    try {
                        //We receive el.imgs like array ["img1 url", "img2 url"], here we turn it into string "holder:img1 sliced url;holder:img2 sliced url"
                        el.imgs = el.imgs.join(';');
                        __holders.forEach((e, i) => {
                            el.imgs = el.imgs.replaceAll(e, '%' + i + ':');
                        })
                        //Creating device
                        const device = await Device.create({ name: el.title, price: Number(el.price), brandId: brands[el.brand], typeId: typeId, img: el.imgs },
                            { transaction: t });
                        //Adding props to device item
                        let _res = await DeviceInfo.bulkCreate(
                            el.props.map(obj => {//Formatting props array like [{"deviceId":"id", textPart:"less than 100 symbols", title:"elss than 100 symbols", "numPart":null}]
                                return {
                                    deviceId: device.id,
                                    textPart: obj.value.length >= 100 ? obj.value.slice(0, 99) : obj.value,
                                    title: obj.name.length >= 100 ? obj.name.slice(0, 99) : obj.name,
                                    numPart: null
                                }
                            }),
                            { transaction: t });
                    } catch (ex) {
                        logger.error("uploadJSON; Adding elements error", ex);
                        throw ex;

                    }
                }
            });
            return res.send("OK");
        } catch (ex) {
            logger.error("uploadJSON; CRASH", ex)
            return next(ApiError.internal("Something was wrong"));
        }
    },
    getFileServers: async (req, res, next) => {
        try {
            return res.json(process.env.FilesHolders);
        } catch (ex) {
            logger.error("getFileServers; !CRASH!", ex);
            return next(ApiError.internal("Can not get file server list"));
        }
    },
    setAdvert: async (req, res, next) => {
        const {json} = req.body;
        try{
            let temp = JSON.parse(json);
            if(!temp.top||!temp.main||!temp.carousel||!temp.panels||!Array.isArray(temp.carousel)||!Array.isArray(temp.panels))
            {
                logger.error("setAdvert;Incorrect advert json", json);
                return next(ApiError.badRequest("Incorrect args"));
            }
            return res.send("TODO");
        }
        catch(ex)
        {
            logger.error("setAdvert;Something was wrong", [ex, json]);
            return next(ApiError.badRequest("Incorrect args"));
        }
    }
}

module.exports = adminControler;
