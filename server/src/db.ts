import { Sequelize } from "sequelize-typescript";
import BasketModel from "./models/BasketModel";
import BrandModel from "./models/BrandModel";
import CommentsModel from "./models/CommentsModel";
import CommonTypeInfoModel from "./models/CommonTypeInfoModel";
import DeviceInfoModel from "./models/DeviceInfoModel";
import DeviceModel from "./models/DeviceModel";
import RatingModel from "./models/RatingModel";
import TypesModel from "./models/TypeModel";
import UserModel from "./models/UserModel";
import logger from "./utils/logger";
const Logger = logger(module);

export default new Sequelize({
    database:process.env.DB_NAME,
    dialect: 'postgres',
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialectOptions: {
        connectTimeout: 60000
    },
    logging: (msg: string) => {
        Logger.info("Posgress", { msg: msg })
    },
    models:[
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

//URI: postgresql://shop_adm:shop_adm@localhost:5432/shop