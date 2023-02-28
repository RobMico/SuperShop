require('dotenv').config({path:'.'+process.env.NODE_ENV+'.env'});
console.log('dot env conf');
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const redis = require('./redisClient');


const cors = require('cors');
const router = require('./routes/index');
const ErrorMiddleware = require('./middleware/errorHandlingMiddleware');
const FileUpload = require('express-fileupload');
const path = require('path');
const { exec } = require('child_process');
const logger = require('./utils/logger')(module);
const dataLoger = require('./utils/dataLogger');
const redisCacheControl = require('./utils/redisCacheControl');
process.env.static = path.resolve(__dirname, 'static');

const redisFiller = require('./utils/redisFiller');

const wait = (time)=>{
    return new Promise((res, rej)=>{
        return setTimeout(res, time);
    });
}


app.use(function (req, res, next) {    
    if(req.headers['x-forwarded-for']&&req.headers['x-forwarded-for']!=req.socket.remoteAddress)
    {
        logger.info('exp;'+req.method+';'+req.originalUrl, {ip:[req.headers['x-forwarded-for'], req.socket.remoteAddress]})    
    }else{
        logger.info('exp;'+req.method+';'+req.originalUrl, {ip:req.socket.remoteAddress})
    }    
    next();
});


app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static(process.env.static));

app.get('/check', (req, res)=>{res.send("WORKING GET");logger.info("POST CHECK")})
app.post('/check', (req, res)=>{res.send("WORKING POST");logger.info("POST CHECK")})
app.use('/api', router);


app.use(ErrorMiddleware);

const start = async ()=>{
    try{
        await wait(10000);
        const sequelize = require('./db');
        await sequelize.authenticate();
        await sequelize.sync();
        dataLoger.info("Postgress:Connected");
        await redis.connect();
        dataLoger.info("Redis:Connected");
        const server = app.listen(PORT, ()=>{logger.debug(`Listening on ${PORT}`);});
    }catch(ex){
        logger.error("Can not start appclication", ex)        
    }
}

start().then(()=>{
    if(process.env.NODE_ENV=="tests")
    {    
        //Run tests
        let child = exec("node ./tests/main.js");
        child.stdout.on('data', function(data) {                  
            //It in not work properly with logger
            console.log('tests: ' + data);
        });
    }
});

// process.on('beforeExit', (code)=>{
//     console.log(code);
//     //logger.info("program exit", code)
// })

// process.on('SIGTERM', ()=>{console.log("HI 1")});
// process.on('SIGINT', ()=>{console.log("HI 2")});


// process.on('SIGINT', function () {
//     console.log('Got SIGINT.  Press Control-D to exit.');
// });

//process.on("SIGUSR2", () => console.log("HEY"));


