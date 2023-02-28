const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')(module);

module.exports = (req, res, next)=>{        
    try{
        const [method, token] = req.headers.authorization.split(' ');
        if(method!='Bearer'||!token)
        {
            return next();               
        }
        const decoded =  jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        logger.info("success")
        return next();
    }catch(ex){  
        return next();
    }
}