const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo, Rating, Comment, sequelize, Op } = require('../models/models');
const ApiErrors = require('../error/ApiError');
const logger = require('../utils/logger')(module);
const fs = require("fs");
const fileWorker = require('../utils/fileWorker');
const __staticPath = path.resolve(__dirname, '..', 'static')
const redisFilterWorker = require('../models/redisFilterWorker');


var deviceControler = {
    fileExtentions: process.env.uploadExtentions ? process.env.uploadExtentions.split(';') : ['.jpg'],
    create: async (req, res, next) => {
        const { name, price, brandId, typeId, info, disabled } = req.body;
        const img = req.files ? req.files.img : null;
        let filesData;
        const externalImgs = req.body.img;

        if (!brandId || !typeId) {
            logger.warning("create;empty data");
            return next(ApiErrors.badRequest("Incorrect args"));
        }
        if (!img || !externalImgs) {
            logger.warning("create;No images");
            return next(ApiErrors.badRequest("No images"));
        }

        //save images
        try {
            if (img) {
                filesData = await fileWorker.saveFiles({ files: img, extentions: deviceControler.fileExtentions });
            }
            else {
                let __holders = process.env.FilesHolders.split(';');
                __holders.forEach((e, i) => {
                    externalImgs = externalImgs.replaceAll(e, '%' + i + ':');
                });
                filesData = { fileName: externalImgs };
            }
        } catch (ex) {
            logger.warning("create;Images saving failed", ex);
            return next(ApiErrors.badRequest("Images saving failed"));
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const device = await Device.create({ name: name, price: Number(price), brandId: brandId, typeId: typeId, img: filesData.fileName, disabled: disabled },
                    { transaction: t });
                if (info) {
                    let _info = JSON.parse(info);
                    await DeviceInfo.bulkCreate(_info.map(obj => { return { deviceId: device.id, textPart: obj.textPart, title: obj.title, numPart: null } }), { transaction: t })
                    redisFilterWorker.addDevice(_info, device.id, device.typeId)
                }
                return res.json(device);
            });
        }
        catch (ex) {
            filesData.removeFile && filesData.removeFile();//remve saved files if query failed
            if (ex.errors) {
                logger.warning("create;valid failed");
                return next(ApiErrors.validation(ex));
            }
            logger.error("create;", ex);
            return next(ApiErrors.badRequest(ex.message));
        }
    },
    getAll: async (req, res, next) => {
        let { typeId, limit, offset, filters } = req.query;
        try {
            //preset params
            limit = limit ? limit : 40;
            offset = offset ? offset : 0;
            let and = Op.and;
            let filter = {};
            let result_key;
            let order = [['avaliable', 'desc']];

            //filling filter obj
            filter[and] = [{ disabled: false }];
            if (typeId) {
                filter[and].push({ typeId: typeId });
            }

            //if filters obj received
            if (filters) {
                filters = JSON.parse(filters);
                if (filters.nameSubstr) {
                    filter[and].push({ name: { [Op.substring]: filters.nameSubstr } });
                }
                if (filters.minPrice && filters.maxPrice) {
                    filter[and].push({ price: { [Op.between]: [filters.minPrice, filters.maxPrice] } });
                }
                else {
                    filters.minPrice && filter[and].push({ price: { [Op.gte]: filters.minPrice } });
                    filters.maxPrice && filter[and].push({ price: { [Op.lte]: filters.maxPrice } });
                }
                if (filters.brands) {
                    filter[and].push({ brandId: { [Op.in]: filters.brands } });
                }
                if (filters.dynamic && filters.dynamic.length > 0) {
                    let _data = await redisFilterWorker.getIds(filters.dynamic, filters.result_key, typeId)
                    result_key = _data[1];
                    if (_data[0]) {
                        filter[and].push({ id: { [Op.in]: _data[0] } })
                    }
                }
                if(filters.sortBy)
                {
                    if(filters.sortBy=='rating')
                    {
                        order.push(['rate', filters.sortOrder?'desc':'asc']);
                    }
                    if(filters.sortBy=='reviews')
                    {
                        order.push(['ratecount', filters.sortOrder?'desc':'asc']);
                    }
                    if(filters.sortBy=='price')
                    {
                        order.push(['price', filters.sortOrder?'desc':'asc']);
                    }
                }
            }

            const devices = await Device.findAndCountAll({
                where: filter, limit: limit, offset: offset, order: order
            });
            devices.result_key = result_key;
            return res.json(devices);
        } catch (ex) {
            logger.error("getall;", ex);
            return next(ApiErrors.badRequest(ex.message));
        }
    },
    getOne: async (req, res, next) => {
        const id = req.params.id;
        const CommentLimit = req.query.CommentLimit || 5;
        try {
            const device = await Device.findOne({
                where: { id: id },
                include: [{ model: DeviceInfo, as: 'info' }]//,{model:Rating, as:'rating', limit:CommentLimit}]
            });
            if (!device) {
                logger.info("getone;device not exist");
                return next(ApiErrors.badRequest("Such device not exists"))
            }
            return res.json(device);
        } catch (ex) {
            logger.error("getone;", ex);
            return next(ApiErrors.internal("Something was wrong"));
        }

    },

    editImages: async (req, res, next) => {
        //TODO
        const { deviceId, removeImgs, addExternal } = req.body;
        const addImages = req.files ? req.files.addImgs : undefined;
        if (!removeImgs && !addImages && !addExternal) {
            logger.warning("editImages;no args")
            return next(ApiErrors.badRequest("Incorrect args"))
        }

        let device = await Device.findOne({ where: { id: deviceId } });
        if (!device) {
            logger.warning('editImages;no such device');
            return next(ApiErrors.badRequest("Device not exist"));
        }

        let images = device.img.split(';');

        //saving new images to current server
        let removeFiles;
        if (addImages) {
            try {

                let tmp = await fileWorker.saveFiles({ files: addImages, extentions: deviceControler.fileExtentions })
                //device.img += tmp.fileName;
                images.push(tmp.fileName);
                removeFiles = tmp.removeFile;
            } catch (ex) {
                logger.warning('editImages;file save error');
                return next(ApiErrors.badRequest("Incorrect args"));
            }
        }
        if (addExternal) {
            try {

                let __holders = process.env.FilesHolders.split(';');
                __holders.forEach((e, i) => {
                    addExternal = addExternal.replaceAll(e, '%' + i + ':');
                });
                images.concat(addExternal.split(';'));
            } catch (ex) {
                logger.warning('editImages;add external images failed', ex);
                return next(ApiErrors.badRequest("Incorrect args"));
            }
        }

        try {
            //removing files
            if (removeImgs) {

                for (let file of removeImgs.split(';')) {
                    if (file) {
                        let tmp = images.length;
                        images = images.filter(e => e != file)
                        //device.img = device.img.replace(file + ';', () => { tmp = false; return '' })
                        if (tmp == images.length) {
                            removeFiles && removeFiles();
                            logger.error("editImages;trying remove unrelated file");
                            return next(ApiErrors.badRequest("incorrect args"))
                        }
                    }
                }
                fileWorker.removeFiles(removeImgs);
            }
        } catch (ex) {
            logger.warning('editImages;error removing image', ex);
            return next(ApiErrors.badRequest("Incorrect args"));
        }


        device.img = images.join(';');
        await device.save();
        return res.json(device);
    },

    editDevice: async (req, res, next) => {
        const { deviceId, name, price, brandId, typeId } = req.body;
        let { info } = req.body;
        if (!deviceId) {
            logger.warning("editDevice;empty data");
            return next(ApiErrors.badRequest("Incorrect args"))
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const device = await Device.findOne({
                    where: { id: deviceId },
                    include: [{ model: DeviceInfo, as: 'info' }]//,{model:Rating, as:'rating', limit:CommentLimit}]
                });
                info = JSON.parse(info);
                let asyncArr = [];

                for (const e of info) {
                    let proto = device.info.find(el => el.id == e.id);
                    if (proto) {
                        if (e.remove) {
                            asyncArr.push(proto.destroy({ transaction: t }))
                        }
                        else {
                            proto.textPart = e.textPart;
                            asyncArr.push(proto.save({ transaction: t }));
                        }
                    }
                    else {
                        e.deviceId = device.id;
                        asyncArr.push(DeviceInfo.create(e, { transaction: t }));
                    }
                }
                device.name = name;
                device.price = Number(price);
                device.brandId = brandId;
                device.typeId = typeId;
                asyncArr.push(device.save({ transaction: t }));
                await Promise.all(asyncArr);
                return res.status(200).send("OK");
            })
        } catch (ex) {
            if (ex.errors) {
                logger.warning("editDevice;valid failed");
                return next(ApiErrors.validation(ex));
            }
            logger.error("editDevice;", ex);
            return next(ApiErrors.badRequest("Incorrect args"))
        }
    },

    getDisabled: async (req, res, next) => {
        let { limit, offset } = req.body;
        limit = limit ? limit : 40;
        offset = offset ? offset : 0;
        try {
            let devices = await Device.findAndCountAll({ where: { disabled: true }, limit: limit, offset: offset });
            return res.json(devices);
        } catch (ex) {
            logger.warning("getDisabled;", ex);
            return next(ApiErrors.badRequest("Incorrect args"))
        }
    },

    setDisable: async (req, res, next) => {
        const { deviceId, disabled } = req.body;
        try {
            const result = await Device.update({ disabled: disabled }, { where: { id: deviceId } });
            return res.json(result);
        } catch (ex) {
            logger.warning("setdisable;", ex);
            return next(ApiErrors.badRequest("Incorrect args"))
        }
    },
    setAvaliable: async (req, res, next) => {
        const { deviceId, avaliable } = req.body;
        try {
            const result = await Device.update({ avaliable: avaliable }, { where: { id: deviceId } });
            return res.json(result);
        } catch (ex) {
            logger.warning("setavaliable;", ex);
            return next(ApiErrors.badRequest("Incorrect args"))
        }
    },


    loadRating: async (req, res, next) => {
        let { deviceId, limit, page } = req.query;
        let offset;
        try {
            limit = limit ? limit : 9;
            page = page ? page : 1;
            offset = (page - 1) * limit;
            if (limit <= 0 || page < 1) {
                logger.info("loadrating;incorrect limit/page");
                return next(ApiErrors.badRequest("Incorrect page/limit"));
            }
        } catch (ex) {
            logger.info("loadrating;incorrect limit/page");
            return next(ApiErrors.badRequest("Incorrect page/limit"));
        }


        try {
            if (req.user) {
                const comments = await Rating.findAll({
                    where: { deviceId: deviceId },
                    limit: limit, offset: offset,
                    order: sequelize.literal(`"rating"."userId"!='${req.user.id}', "rating"."id" DESC`),
                    include: [{
                        model: Comment, as: 'comments', order: [[{ model: Comment }, 'id', 'DESC']],
                    }]
                });
                return res.json(comments);
            }
            else {
                const comments = await Rating.findAll({
                    where: { deviceId: deviceId },
                    limit: limit, offset: offset,
                    order: [['id', 'DESC']],
                    include: [{ model: Comment, as: 'comments', order: [[{ model: Comment }, 'id', 'DESC']] }]
                });
                return res.json(comments);
            }
        } catch (ex) {
            logger.error("loadrating;invalid args?", ex);
            return next(ApiErrors.badRequest(ex.message));
        }

    },

    postRating: async (req, res, next) => {
        const { comment, rate, deviceId } = req.body;
        const user = req.user;
        try {
            const candidate = await Rating.findOne({ where: { userId: user.id, deviceId: deviceId } });
            if (candidate) {
                logger.warning("postrating;already rated");
                return next(ApiErrors.badRequest("This user already rated this device"));
            }


            const result = await sequelize.transaction(async (t) => {
                const rating = await Rating.create({ comment: comment, rate: rate, deviceId: deviceId, userId: user.id, userName: user.email },
                    { transaction: t });
                let result = await Device.update(
                    {
                        'rate': sequelize.literal(`(rate*ratecount+${rating.rate})/(ratecount+1)`),
                        'ratecount': sequelize.literal('ratecount+1')
                    },
                    { where: { id: deviceId } }, { transaction: t });
                return res.json({});
            });
        } catch (ex) {
            if (ex.errors) {
                logger.info("postrating;valid failed");
                let errors = ex.errors.map((ex) => { return { type: ex.type, message: ex.message, field: ex.path } });
                return next(ApiErrors.badRequest(errors));
            }
            logger.error("postrating;", ex);
            return next(ApiErrors.badRequest(ex.message));
        }
    },
    // removeOne: async (req, res, next) => {
    //     const {deviceId} = req.body;
    //     if(!deviceId)
    //     {
    //         logger.error("removeone;no args", ex);
    //         return next(ApiErrors.badRequest("Incorrect args"))
    //     }
    //     try{
    //         const result = await Device.destroy({where: { id:deviceId }});
    //         if(result==0)
    //         {
    //             logger.error("removeone;item not exist", ex);
    //             return next(ApiErrors.badRequest("No such device"))
    //         }
    //         return res.json(result);
    //     }catch(ex){
    //         logger.error("removeone;", ex);
    //         return next(ApiErrors.badRequest(ex.message))
    //     }        
    // },

    // removeRating:async (req, res, next) => {
    //     const {ratingId} = req.body;
    //     if(!ratingId)
    //     {
    //         logger.error("removerating;no args", ex);
    //         return next(ApiErrors.badRequest("Incorrect args"))
    //     }
    //     try{
    //         const result = await Device.destroy({where: { id:ratingId }});
    //         if(result==0)
    //         {
    //             logger.error("removerating;item not exist", ex);
    //             return next(ApiErrors.badRequest("No such rating"))
    //         }
    //         return res.json(result);
    //     }catch(ex){
    //         logger.error("removerating;", ex);
    //         return next(ApiErrors.badRequest(ex.message))
    //     }        
    // }
};

module.exports = deviceControler;