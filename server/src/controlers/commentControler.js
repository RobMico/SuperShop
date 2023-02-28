const {Comment} = require('../models/models');
const ApiError = require('../error/ApiError');
const logger = require('../utils/logger')(module);


var commentControler = {
postNew: async (req, res, next)=>{
    const {comment, ratingId} = req.body;
    const user = req.user;
    if(!comment||!ratingId)
    {
        logger.info("postnew;Empty data")
        return next(ApiError.badRequest('Field comment not found'));        
    }
    try{
        const result = await Comment.create({comment:comment, ratingId:ratingId, userName:user.email, userId:user.id});
        return res.json(result); 
    }catch(ex){
        if(ex.errors)
        {
            logger.info("postnew;valid failed")
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.error("postnew;", ex)
        return next(ApiError.internal('Something was wrong'));
    }
},
edit:async (req, res, next)=>{
    const {comment, commentId} = req.body;    
    const user = req.user;
    if(!comment||!commentId)
    {
        logger.info("edit;Empty data")
        return next(ApiError.badRequest('Field comment not found'));        
    }
    try{
        const result = await Comment.update({comment:comment}, {where:{id:commentId, userId:user.id}});
        return res.json(result); 
    }catch(ex){
        if(ex.errors)
        {
            logger.info("edit;valid failed")
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.warning("edit;incorrect args?", ex)
        return next(ApiError.badRequest('Incorrect args'));
    }
},
remove:async (req, res, next)=>{
    const {commentId} = req.body;        
    if(!commentId)
    {
        logger.warning("remove;Empty data")
        return next(ApiError.badRequest('Field commentId not found'));        
    }
    try{
        const result = await Comment.destroy({where:{id:commentId}});
        if(result == 0)
        {
            logger.warning("remove;comment not exist");
            return next(ApiError.badRequest('Comment not exsist'));        
        }
        else{
            return res.json(result); 
        }
    }catch(ex){
        if(ex.errors)
        {
            logger.warning("remove;valid failed")
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.warning("remove;incorrect args?", ex)
        return next(ApiError.badRequest('Incorrect args'));
    }
},

getComments: async (req, res, next)=>{
    //TODO
    res.send('TODO');
},
};
module.exports = commentControler;