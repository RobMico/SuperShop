const client = require('../redisClient');
const { sequelize, Device, DeviceInfo } = require('../models/models');
const {commandOptions} = require('redis')

var objectMap = function (obj, callback) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof callback === 'function') {
                result.push(callback(obj[key], key, obj));
            }
        }
    }
    return result;
};




module.exports = {
    recreateRedisStorage: async (types) => {
        let keys = await client.keys('*');
        for (const e of keys) {
            await client.del(e);
        }

        for (const key of Object.keys(types)) {

            //Creating empty keys for type/devices and types/filters
            await client.lPush('type_' + key, '');
            await client.setBit('typeD_' + key, 0, 0);

            //creating empty filter/device bitmep, and adding filter key to types/filters array
            for (let i = 0; i < types[key].length; i++) {
                await client.setBit(types[key][i], 0, 0);
                await client.lPush('type_' + key, types[key][i]);
                //all strings in raw sql should be under ''
                types[key][i] = "'" + types[key][i] + "'"
            }

            //Array of filters to sting like ('val1', 'val2', ...)
            let values = types[key].join(',');
            const limit = 2;
            let offset = 0;
            //data result template
            let data = { count: (limit + 1) }

            for (; offset < data.count; offset += limit) {

                data = await Device.findAndCountAll({
                    limit: limit, offset: offset,
                    where: {
                        typeId: key
                    },
                    attributes: ['id', 'typeId'],
                    include: [{
                        model: DeviceInfo, as: 'info',
                        required: false,
                        attributes: [[sequelize.fn('CONCAT', sequelize.col('title'), '_', sequelize.col('textPart')), 'key']],
                        where: sequelize.literal(`CONCAT("title",'_',"textPart") in (` + values + `)`)
                        //  attributes: [[sequelize.fn('SUM', (sequelize.fn('COALESCE', (sequelize.col('base_income')), 0), sequelize.literal('+'), sequelize.fn('COALESCE', (sequelize.col('user_taxes')), 0))), 'total_sal']],
                    }]
                })
                
                for (const y of data.rows) {
                    await client.setBit('typeD_' + y.typeId, y.id, 1);
                    //Adding devices to type/device redis bitmap
                    for (const props of y.info) {                        
                        //Adding device to filter bitmap
                        await client.setBit(props.dataValues.key, y.id, 1);
                    }
                }
            }

        }
    }
}