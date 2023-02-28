const ApiError = require('../error/ApiError');
const {Basket, Device} = require('../models/models');
const logger = require('../utils/logger')(module);

var basketControler = {
buy: async (req, res, next)=>{
    //TODO
    res.send('buy');
},
add: async (req, res, next)=>{
    const {deviceId, deviceCount} = req.body;
    const user = req.user;    
    try{        
        try{
            const candidate = await Basket.findOne({where:{deviceId:deviceId, userId:user.id}});
            if(candidate)
            {            
                logger.info('add;item already in basket');
                return next(ApiError.badRequest("Such device already in your basket"));
            }
        }
        catch(ex){
            logger.info("add;incorrect args")
            return next(ApiError.badRequest("Incorrect args"));
        }        
        const result = await Basket.create({deviceId:deviceId, count:deviceCount, userId:user.id});
        return res.json(result)
    }catch(ex){
        if(ex.errors)
        {
            logger.info("add;validation failed");
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.error("add;Unhandled error", ex);
        return next(ApiError.badRequest("Something was wrong"));
    }
},
remove: async (req, res, next)=>{    
    const {basketId} = req.body;
    const user = req.user;
    try{
        const basket = await Basket.destroy({where:{userId:user.id, id:basketId}});
        if(basket == 0)
        {
            logger.info("remove;device not exist")
            return next(ApiError.badRequest('No such device in basket'));
        }        
        return res.json(basket);
    }catch(ex){                    
        if(ex.errors)
        {
            logger.info("remove;validation failed")
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.warning("remove;incorrect args?")
        return next(ApiError.badRequest("Incorrect args"));
    }
},
getAll: async (req, res, next)=>{
    
    const user = req.user;
    try{
        const basket = await Basket.findAll({where:{userId:user.id}, include:{model:Device, as:'device'}});
        return res.json(basket);
    }catch(ex)
    {
        if(ex.errors)
        {
            logger.info("getall;validation failed")
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.error("getall;", ex)
        return next(ApiError.badRequest("Something was wrong"));
    }
     
}
};
module.exports = basketControler;