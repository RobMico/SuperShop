const ApiError = require('../error/ApiError');
const logger = require('../utils/logger')(module);

module.exports = (err, req, res, next)=>{
    if(err instanceof ApiError)
    {
        return res.status(err.status).json({message:err.message});
    }
    console.log(err)
    logger.error("Unhandled error", err);
    res.status(500).json({message:"Unhandled error"})
};
 