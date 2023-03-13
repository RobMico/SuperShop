import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import UserModel from '../src/models/UserModel';
import BasketModel from '../src/models/BasketModel';
import TypesModel from '../src/models/TypeModel';
import RatingModel from '../src/models/RatingModel';
import DeviceInfoModel from '../src/models/DeviceInfoModel';
import CommonTypeInfoModel from '../src/models/CommonTypeInfoModel';
import DeviceModel from '../src/models/DeviceModel';
import BrandModel from '../src/models/BrandModel';
import CommentsModel from '../src/models/CommentsModel';
import { createClient, RedisClientType } from 'redis';
dotenv.config({ path: '.test.env' });


let sequelize: Sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialectOptions: {
        connectTimeout: 60000
    },
    logging: false,
    models: [
        UserModel,
        BasketModel,
        DeviceModel,
        TypesModel,
        BrandModel,
        RatingModel,
        CommentsModel,
        DeviceInfoModel,
        CommonTypeInfoModel
    ]
});

let redisClient:RedisClientType;

before(async function () {
    await sequelize.authenticate();
    await sequelize.sync();

    redisClient = await createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),

        },
        database: 1
    });

    //Drop db
    await sequelize.query(`DO $$DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DELETE FROM ' || quote_ident(r.tablename) || ';';
        END LOOP;
    END$$;`);

    await redisClient.flushAll();

});

export { sequelize, redisClient };