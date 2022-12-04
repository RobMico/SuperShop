const ApiError = require('../error/ApiError');
const {User, Rating} = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const logger = require('../utils/logger')(module);

var userControler = {
registration : async (req, res, next)=>{
    try{
        const {email, password, name} = req.body;
        //console.log(req.body)
        if(!email||!password||!name||typeof password != 'string'||password.length<5||password.length>15)
        {   
            logger.info("register;incorrect args");
            return next(ApiError.badRequest('Incorrect email or password'));
        }
        const candidate = await User.findOne({where:{email:email}});
        if(candidate)
        {
            logger.info("register;email exists");
            return next(ApiError.badRequest('User with this email already exist'));;
        }
        const hashPassword = await bcrypt.hash(password, 5);
        
        const user = await User.create({email:email,password:hashPassword, name:name});            

        const token = jwt.sign({id:user.id, email:user.email, role:user.role}, process.env.SECRET_KEY, {expiresIn:'24h'});    
        return res.json({token:token});
        
    }catch(ex){        
        if(ex.errors)
        {
            logger.info("register;valid failed");
            let errors = ex.errors.map((ex)=>{return {type:ex.type, message:ex.message, field:ex.path}});            
            return next(ApiError.badRequest(errors));
        }
        logger.error("register;", ex);
        return next(ApiError.internal('Something was wrong'));
    }
    

},
login : async (req, res, next)=>{
try{
    const {email, password} = req.body;
    if(!email||!password||typeof password != 'string'||typeof email != 'string')
    {
        logger.info("login;incorrect args");
        return next(ApiError.badRequest('Incorrect email or password'));        
    }
    const user = await User.findOne({where:{email:email}});
    if(!user)
    {
        return next(ApiError.badRequest('User not found'));        
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if(!comparePassword)
    {
        return next(ApiError.badRequest('Incorrect password')); 
    }

    const token = jwt.sign({id:user.id, email:user.email, role:user.role}, process.env.SECRET_KEY, {expiresIn:'24h'});

    return res.json({token:token});
}catch(ex)
{
    logger.error("login;", ex);
    return next(ApiError.internal('Something was wrong'));
}

},
checkAuth : async (req, res, next)=>{
    try{
        var user = req.user;
        const token =jwt.sign({id:user.id, email:user.email, role:user.role}, process.env.SECRET_KEY, {expiresIn:'24h'});
        const decoded =  jwt.verify(token, process.env.SECRET_KEY);
        return res.json({token:token});
    }catch(ex)
    {
        logger.error("auth;", ex)
        return next(ApiError.internal('Something was wrong'));
    }
},

getComments: async(req, res, next)=>{
    let {limit, page} = req.query;
    let offset;
    const user = req.user;

    try{
        limit = limit?limit:9;
        page = page?page:1;
        offset = (page-1)*limit;
        if(limit<=0||page<=0)
        {
            logger.info('getcomments;incorrect limit');
            return next(ApiError.badRequest("Incorrect page/limit"));
        }
    }catch(ex){
        logger.info('getcomments;incorrect limit');
        return next(ApiError.badRequest("Incorrect page/limit"));
    }    
    
    try{
        const comments =  await Rating.findAndCountAll({where:{userId:user.id}, limit:limit, offset:offset});
        return res.json(comments);
    }catch(ex)
    {
        logger.error('getcomments;', ex);
        return next(ApiError.badRequest(ex.message));
    }
}
}
module.exports = userControler;