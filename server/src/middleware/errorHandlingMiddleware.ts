//No used anymore, TO REMOVE

import ApiError from "../error/ApiError";
import Logger from "../utils/logger";
const logger = Logger(module);

export default (err, req, res, next)=>{
    if(err instanceof ApiError)
    {
        return res.status(err.status).json({message:err.message});
    }
    logger.error("Unhandled error", err);
    res.status(500).json({message:"Unhandled error"})
};
 