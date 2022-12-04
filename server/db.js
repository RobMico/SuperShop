const {Sequelize} = require('sequelize');
const dataLogger = require('./utils/dataLogger');

module.exports = new Sequelize(    
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:'postgres',
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        logging: (msg) => {            
            dataLogger.info("Posgress", {msg: msg})
        }
    },
    
);

//URI: postgresql://shop_adm:shop_adm@localhost:5432/shop