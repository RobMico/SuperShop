const {Brand} = require('../models/models');
const ApiError = require('../error/ApiError');
const logger = require('../utils/logger')(module);
const fileWorker = require('../utils/fileWorker');


var brandControler = {
fileExtentions:process.env.uploadExtentions?process.env.uploadExtentions.split(';'):['.jpg'],

create : async (req, res, next)=>{    
    const {name, description} = req.body;
    //const img = req.files?req.files.img:undefined;
    //let removeFile;    
    //let fileName = null;

    if(!name)
    {
        logger.warning("create;name not found");
        return next(ApiError.badRequest('Field name not found'));        
    }

    // if(img&&img.mv)
    // {
    //     try{
    //         let temp = await fileWorker.saveFile({file:img,path:'brands', extentions:brandControler.fileExtentions})
            
    //         removeFile = temp.removeFile;
    //         fileName = temp.fileName;

    //     }catch(ex){            
    //         logger.warning("create;Image save error");
    //         return next(ApiError.badRequest("Image save error"));
    //     }
    // }
    
    
    try{
        let params ={name:name, img:fileName, description:description?description:null}
        const brand = await Brand.create(params);
        return res.json(brand);
    }catch(ex){
        removeFile&&removeFile();
        if(ex.errors)
        {
            logger.info("create;valid failed");            
            return next(ApiError.validation(ex));
        }
        logger.error("create;", ex);
        return next(ApiError.internal('Something was wrong'));
    }
},
getAll : async (req, res, next)=>{    
    try{
        const brands = await Brand.findAll();
        return res.json(brands);
    }catch(ex){
        logger.error("getall;", ex);        
        return next(ApiError.internal('Something was wrong'));
    }
},


// removeOne:async (req, res, next)=>{
//     const {brandId} = req.body;
//     if(!brandId)
//         {
//             logger.error("removeone;no args", ex);
//             return next(ApiError.badRequest("Incorrect args"))
//         }
//         try{
//             const result = await Brand.destroy({where: { id:brandId }});
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


edit:async (req, res, next)=>{
    const {brandId, name, description} = req.body;
    const img = req.files?req.files.img:undefined;

    if(!brandId)
    {
        logger.warning("edit;brandId not defined");
        return next(ApiError.badRequest("brandId not defined"));
    }
    //if image change needed(we got correct image)
    if(img&&img.mv)
    {
        try{
            const brand = await Brand.findOne({where:{id:brandId}});
            if(!brand)
            {
                logger.warning("edit;no such brand");                
                return next(ApiError.badRequest("Brand not exist"));   
            }

            let fileName = brand.img;            
            if(brand.img)//if image already exist
            {                
                await fileWorker.saveFile({file:img,path:'brands', extentions:brandControler.fileExtentions, name:brand.img})
            }
            else{//if not exist
                let temp = await fileWorker.saveFile({file:img,path:'brands', extentions:brandControler.fileExtentions});
                brand.img = temp.fileName;
            }

            //set brand params if it changed
            if(name&&name!=brand.name)
            {
                brand.name = name;
            }            
            if(description&&description!=brand.description)
            {
                brand.description = description;
            }


            await brand.save();
            return res.json(1);


        }catch(ex)
        {
            if(ex.errors)
            {
                logger.warning("edit;valid failed");                
                return next(ApiError.validation(ex));
            }
            logger.error("edit;", ex);
            return next(ApiError.internal('Something was wrong'));   
        }
    }
    else{
        try{
            let params={};
            if(name)
            {params.name = name}
            if(description)
            {params.description = description}
            let result = await Brand.update(params, {where:{id:brandId}});
            return res.json(result);
        }
        catch(ex)
        {
            if(ex.errors)
            {
                logger.info("edit;valid failed");                
                return next(ApiError.validation(ex));
            }
            logger.error("edit;", ex);
            return next(ApiError.internal('Something was wrong'));
        }
    }    
}
}
module.exports = brandControler;