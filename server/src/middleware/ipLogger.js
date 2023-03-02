const logger = require('../utils/logger')(module);

module.exports = (err, req, res, next)=>{
    if(req.headers['x-forwarded-for']&&req.headers['x-forwarded-for']!=req.socket.remoteAddress)
    {
        logger.info('exp;'+req.method+';'+req.originalUrl, {ip:[req.headers['x-forwarded-for'], req.socket.remoteAddress]})    
    }else{
        logger.info('exp;'+req.method+';'+req.originalUrl, {ip:req.socket.remoteAddress})
    }    
    next();
};
 