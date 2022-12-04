const { Type, DeviceInfo, Device, sequelize, Op } = require('../models/models');
const ApiError = require('../error/ApiError');
const logger = require('../utils/logger')(module);
const fileWorker = require('../utils/fileWorker');
const redisFilterWorker = require('../models/redisFilterWorker')

// var groupBy = function(xs, key) {
//     return xs.reduce(function(rv, x) {
//       (rv[x[key]] = rv[x[key]] || []).push(x);
//       return rv;
//     }, {});
// };




var typeControler = {
    fileExtentions: process.env.uploadExtentions ? process.env.uploadExtentions.split(';') : ['.jpg'],

    create: async (req, res, next) => {
        const { name, description, externalImg } = req.body;
        const img = req.files ? req.files.img : undefined;
        let removeFile;
        let fileName = null;

        if (!name) {
            logger.warning("create;name not found");
            return next(ApiError.badRequest('Field name not found'));
        }

        if (img && img.mv) {
            try {
                let temp = await fileWorker.saveFile({ file: img, path: 'types', extentions: typeControler.fileExtentions })
                removeFile = temp.removeFile;
                fileName = temp.fileName;
            } catch (ex) {
                logger.warning("create;Image save error");
                return next(ApiError.badRequest("Image save error"));
            }
        }
        else if (externalImg) {
            let __holders = process.env.FilesHolders.split(';');
            __holders.forEach((e, i) => {
                externalImg = externalImg.replaceAll(e, '%' + i + ':');
            });
            fileName = externalImg;
        }

        try {
            let params = { name: name, img: fileName, description: description ? description : null }
            const type = await Type.create(params);
            redisFilterWorker.addType(type.id);
            return res.json(type);
        } catch (ex) {
            removeFile && removeFile();
            if (ex.errors) {
                logger.info("create;valid failed");
                return next(ApiError.validation(ex));
            }
            logger.error("create;", ex);
            return next(ApiError.internal('Something was wrong'));
        }
    },

    getAll: async (req, res, next) => {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (ex) {
            logger.error("getall;", ex);
            return next(ApiError.internal('Something was wrong'));
        }
    },

    // removeOne:async (req, res, next)=>{
    //     const {typeId} = req.body;
    //     if(!typeId)
    //         {
    //             logger.error("removeone;no args", ex);
    //             return next(ApiError.badRequest("Incorrect args"))
    //         }
    //         try{
    //             const result = await Type.destroy({where: { id:typeId }});
    //             if(result==0)
    //             {
    //                 logger.error("removeone;item not exist", ex);
    //                 return next(ApiError.badRequest("No such device"))
    //             }
    //             return res.json(result);
    //         }catch(ex){
    //             logger.error("removeone;", ex);
    //             return next(ApiError.badRequest(ex.message))
    //         }
    // },

    edit: async (req, res, next) => {
        const { typeId, name, description } = req.body;
        const img = req.files ? req.files.img : undefined;

        if (!typeId) {
            logger.warning("edit;typeId not defined");
            return next(ApiError.badRequest("typeId not defined"));
        }
        //if image change needed(we got correct image)
        if (img && img.mv) {
            try {
                const type = await Type.findOne({ where: { id: typeId } });
                if (!type) {
                    logger.warning("edit;no such type");
                    return next(ApiError.badRequest("type not exist"));
                }


                if (type.img)//if image already exist
                {
                    await fileWorker.saveFile({ file: img, path: 'types', extentions: typeControler.fileExtentions, name: type.img })
                }
                else {//if not exist                
                    let temp = await fileWorker.saveFile({ file: img, path: 'types', extentions: typeControler.fileExtentions });
                    type.img = temp.fileName;
                }

                //set type params if it changed
                if (name && name != type.name) {
                    type.name = name;
                }
                if (description && description != type.description) {
                    type.description = description;
                }


                await type.save();
                return res.json(1);


            } catch (ex) {
                if (ex.errors) {
                    logger.warning("edit;valid failed");
                    return next(ApiError.validation(ex));
                }
                logger.error("edit;", ex);
                return next(ApiError.internal('Something was wrong'));
            }
        }
        else {
            try {
                let params = {};
                if (name) { params.name = name }
                if (description) { params.description = description }
                let result = await Type.update(params, { where: { id: typeId } });
                return res.json(result);
            }
            catch (ex) {
                if (ex.errors) {
                    logger.info("edit;valid failed");
                    return next(ApiError.validation(ex));
                }
                logger.error("edit;", ex);
                return next(ApiError.internal('Something was wrong'));
            }
        }
    },


    addTypeProp: async (req, res, next) => {
        let { typeId, title, values } = req.body;
        if (!typeId) {
            logger.warning("addTypeProp;typeId not defined");
            return next(ApiError.badRequest("typeId not defined"))
        }
        try {
            values = JSON.parse(values);
            let result = await DeviceInfo.findAll({ where: { title: title, textPart: { [Op.in]: values } } });


            //Getting empty filters
            values = values.filter(e => !result.find(el => el.textPart == e))

            //Creatig fields for empty filters(to avoid crashing on null)
            for (e of values) {
                await redisFilterWorker.addFilter(typeId, title + '_' + e, [])
            }

            let resObj = {};
            result.forEach(e => {
                resObj[e.title + "_" + e.textPart] ? resObj[e.title + "_" + e.textPart].push(e.deviceId) : (resObj[e.title + "_" + e.textPart] = [e.deviceId])
            })

            for (e in resObj) {
                await redisFilterWorker.addFilter(typeId, e, resObj[e])
            }




            return res.send("OK");
        } catch (ex) {
            if (ex.errors) {
                logger.warning("addTypeProp;validation failed");
                return next(ApiError.validation(ex));
            }
            if (ex.name && ex.name == 'SequelizeForeignKeyConstraintError') {
                logger.warning("addTypeProp;such type not exist", ex);
                return next(ApiError.badRequest("Incorrect args"));
            }
            logger.error("addTypeProp;", ex);
            return next(ApiError.badRequest("Incorrect args"));
        }
    },

    //DISABLED
    editTypeProp: async (req, res, next) => {
        const { propId, name, require, filter, searchByNum, searchProps } = req.body;
        if (!propId) {
            logger.warning("editTypeProp;propId not defined");
            return next(ApiError.badRequest("incorrect args"))
        }

        try {
            let result = await CommonTypeInfo.update({ name: name, require: require, filter: filter, searchByNum: searchByNum, searchProps: searchProps }, { where: { id: propId } });
            return res.json(result);
        } catch (ex) {
            if (ex.errors) {
                logger.warning("editTypeProp;validation failed");
                return next(ApiError.validation(ex));
            }
            logger.error("editTypeProp;", ex);
            return next(ApiError.badRequest("Incorrect args"));
        }
    },
    //DISABLED
    removeTypeProp: async (req, res, next) => {
        const { propId } = req.body;
        if (!propId) {
            logger.warning("removeTypeProp;propId not defined");
            return next(ApiError.badRequest("incorrect args"))
        }
        try {
            let result = await CommonTypeInfo.destroy({ where: { id: propId } });
            return res.json(result);
        } catch (ex) {
            logger.error("removeTypeProp;", ex);
            return next(ApiError.badRequest("Incorrect args"));
        }
    },

    getTypeProps: async (req, res, next) => {
        const { typeId, filter, require } = req.query;
        if (!typeId) {
            logger.warning("getTypeProps;typeId not defined");
            return next(ApiError.badRequest("incorrect args"))
        }
        try {
            const result = await redisFilterWorker.getFilters(typeId)
            return res.json(result);
        } catch (ex) {
            logger.error("getTypeProps;something was wrong", ex);
            return next(ApiError.badRequest("incorrect args"));
        }
    },

    loadSuggestions: async (req, res, next) => {
        const { propName } = req.body;
        if (propName) {
            let suggestCount = [sequelize.fn('COUNT', sequelize.col('textPart')), 'count']
            let result = await DeviceInfo.findAll({ where: { title: propName }, group: ['textPart'], attributes: ['textPart', suggestCount] })
            return res.json(result);
        }
        else {
            logger.error("loadSuggestions;incorrect args");
            return next(ApiError.badRequest("incorrect args"));
        }
    }




};
module.exports = typeControler;