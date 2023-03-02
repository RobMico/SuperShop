import { Sequelize } from "sequelize";
import logger from "./utils/logger";
const Logger = logger(module);

export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialectOptions: {
            connectTimeout: 60000
        },
        logging: (msg: string) => {
            Logger.info("Posgress", { msg: msg })
        }
    },

);

//URI: postgresql://shop_adm:shop_adm@localhost:5432/shop