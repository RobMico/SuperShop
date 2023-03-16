import * as dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
//const cors = require('cors');
dotenv.config({ path: '.' + process.env.NODE_ENV + '.env' });
process.env.static = path.resolve(__dirname, 'static');
import express, { Express, Request, Response } from 'express';
import redis from './src/redisClient';
import sequelize from './src/db';
import router from './src/routes/index';
import loggerMiddlerware from './src/middleware/ipLogger';
import FileUpload from 'express-fileupload';
import logger from './src/utils/logger';

const PORT: number = parseInt(process.env.PORT) || 5000;
const app: Express = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(FileUpload());
app.use(express.static(process.env.static));

app.use(loggerMiddlerware);
app.use('/api', router);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await redis.connect();
        const server = app.listen(PORT, () => { logger.debug(`Listening on ${PORT}`); });
    } catch (ex) {
        logger.error("Can not start appclication", ex)
    }
}

start();


//DB_URI=postgresql://localhost:5432/shop?user=shop_adm&password=shop_adm
//CONNECT=psql -U shop_adm -d shop

//SELECT CONCAT('DROP TABLE ',table_name,' CASCADE;') FROM information_schema.tables WHERE table_schema = 'public';