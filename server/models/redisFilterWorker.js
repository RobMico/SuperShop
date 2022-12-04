let client = require('../redisClient');
const uuid = require('uuid');
const redisCacheControl = require('../utils/redisCacheControl');
const logger = require('../utils/logger')(module);
const { commandOptions } = require('redis');
const { set } = require('../db');


function GetBits(bytes) {
    let ids = []
    for (let i = 0; i < bytes.length; i++) {        // iterate in bytes (8 products at once)
        for (let j = 7; j >= 0; j--) {              // iterate over bits in current 8-products chunk                
            if (bytes[i] & (1 << j)) {              // >0 if bit was 1, otherwise 0
                ids.push((8 * i + (8 - j)) - 1)     // convenient when there are comments?
            }                                       // unfortunately I can't write like this(.
        }
    }
    return ids;
}

let filterWorker =
{
    lockTypeUpdate: false,
    unlockTypeUpdate: [],
    temp: async () => {
        client.sendCommand(['FLUSHALL'])
        // client.del('type0')
        // client.del('size_18')
        // client.del('color_red')
        // client.del('color_blue')
    },
    //?
    addType: async (typeId, safe = false) => {
        client.lPush(('type_' + typeId), [])
        client.setBit(('typeD_' + typeId), 0, 0)
    },
    checkType: async (typeId) => {
        if (!filterWorker.lockTypeUpdate) {
            filterWorker.lockTypeUpdate = true
            let tmp = await client.lRange(('type_' + typeId), 0, -1)
            let set = new Set(tmp);
            await client.del(('type_' + typeId))
            await client.lPush(('type_' + typeId), [...set])
            for (e of filterWorker.unlockTypeUpdate) {
                await e();
            }
            filterWorker.unlockTypeUpdate = [];
            filterWorker.lockTypeUpdate = false;
            return true
        }
        else {
            filterWorker.unlockTypeUpdate.push(async () => {
                let tmp = await client.lRange(('type' + typeId), 0, -1)
                let set = new Set(tmp);
                await client.del(('type' + typeId))
                await client.lPush(('type' + typeId), [...set])
            })
        }
    },
    addFilter: async (typeId, prop, device_ids) => {
        if (!filterWorker.lockTypeUpdate) {
            filterWorker.lockTypeUpdate = true;
            let _tmp = await client.lRange(('type_' + typeId), 0, -1)

            if (!await client.exists(prop)) {
                client.lPush(('type_' + typeId), prop)
            }
            else if (!(await client.lRange(('type_' + typeId), 0, -1)).includes(prop)) {
                client.lPush(('type_' + typeId), prop)
            }


            //client
            for (e of device_ids) {
                await client.setBit(prop, e, 1);
            }

            if (device_ids.length == 0) {
                await client.setBit(prop, 1, 0)
            }

            for (e of filterWorker.unlockTypeUpdate) {
                await e();
            }
            filterWorker.unlockTypeUpdate = [];
            filterWorker.lockTypeUpdate = false;
            return true
        }
        else {
            filterWorker.unlockTypeUpdate.push(async () => {
                if (!await client.exists(prop)) {
                    client.lPush(('type_' + typeId), prop)
                }
                else if (!(await client.lRange(('type_' + typeId), 0, -1)).includes(prop)) {
                    client.lPush(('type_' + typeId), prop)
                }
                for (e of device_ids) {
                    client.setBit(prop, e, 1);
                }
                if (device_ids.length == 0) {
                    await client.setBit(prop, 1, 0)
                }
            });
        }

    },
    editFilter: async (previous, newVal, id) => {
        previous && client.setBit(previous, id, 0);
        newVal && client.setBit(newVal, id, 1);
        return true;
    },
    addDevice: async (props, deviceId, typeId) => {
        let stored = await client.lRange(('type_' + typeId), 0, -1);
        await client.setBit(('typeD_' + typeId), deviceId, 1);
        props.forEach(e1 => {
            let tmp = e1.title + '_' + e1.textPart
            stored.forEach(e2 => {
                if (tmp == e2) {
                    client.setBit(e2, deviceId, 1)
                }
            })
        });
        return true;
    },
    getFilters: async (typeId) => {
        if (!typeId) {
            throw new Error("No typeId")
        }

        //If this data cached, load from cache
        let cache = await client.get(`*_type${typeId}Props`);
        if (cache) {
            try {
                logger.info("getFilters;loading cache");
                return JSON.parse(cache);
            }
            catch (ex) {
                logger.error("getFilters;Loading cache error", ex);
            }
        }
        let stored = await client.lRange(('type_' + typeId), 0, -1);
        let result = []
        for (e of stored) {
            if (e) {
                try {

                    let temp_key = "*_" + uuid.v4();
                    await client.bitOp('AND', temp_key, [('typeD_' + typeId), e]);
                    count = await client.bitCount(temp_key);
                    // console.log(e, 'type:', typeId)
                    // let tmp = await client.get(commandOptions({ returnBuffers: true }), 'typeD_' + typeId)
                    // console.log(tmp)
                    // let ids = GetBits(tmp)
                    // console.log(ids)      

                    // tmp = await client.get(commandOptions({ returnBuffers: true }), e)
                    // console.log(tmp)
                    // ids = GetBits(tmp)
                    // console.log(ids)  


                    // tmp = await client.get(commandOptions({ returnBuffers: true }), temp_key)
                    // console.log(tmp)
                    // ids = GetBits(tmp)
                    // console.log(ids)
                    result.push({ str: e, count: count })
                } catch { }
            }
        }
        client.set(`*_type${typeId}Props`, JSON.stringify(result));
        return result;
    },
    getIds: async (filters, resultKey, typeId) => {
        if (!filters||filters.length == 0) {//exit if no filters
            return;
        }
        if (resultKey) { //if such a request has been executed before, load it
            let cache = await client.get(commandOptions({ returnBuffers: true }), resultKey);
            if (cache) {
                logger.info("getIds;loading from cache");
                let ids = GetBits(cache);
                return [ids, resultKey];
            }
        }

        //if cache storing disabled all temporary data keys will be stored in this arr, and will be deleted after
        let removeAfter = [];
        //there are two operations in filters OR for same attribute and AND for different attributes
        //we gots it like [["color_blue" OR "color_red"] AND "RAM_16" AND ["" OR "" OR ""] ...]
        //so firstly we iterate through AND array and executing all OR op saving result keys to "concated",
        //then executing AND for concated
        let concated = Array(filters.length);
        for (let i = 0; i < concated.length; i++) {//executing OR
            if (!Array.isArray(filters[i])) {//if no OR op to execute - just store key
                concated[i] = filters[i];
            }
            else {
                let temp = "*_" + filters[i]
                concated[i] = temp;
                //check cache                
                let cache = await client.exists("*_" + filters[i])
                if (cache) {
                    logger.info("getIds;loading from cache filters");
                    continue;
                }
                else {//if no cache
                    await client.bitOp('OR', temp, filters[i])
                    if (redisCacheControl.useCache) {
                        await redisCacheControl.saveFilterConcat(temp)
                    }
                    else {
                        removeAfter.push(temp);
                    }
                }
            }
        }

        if (typeId) {
            concated.push('typeD_' + typeId);
        }

        let result_key = "*_" + uuid.v4();
        //executing AND op for concated
        await client.bitOp('AND', result_key, concated)
        let tmp = await client.get(commandOptions({ returnBuffers: true }), result_key)
        
        if (redisCacheControl.useCache) {//if cache enabled, store keys to cache storage
            await redisCacheControl.saveFilterConcat(result_key);
        }
        else {//else remove all temporary data
            await client.del(removeAfter);
            await client.del(result_key);
        }
        
        
        if (tmp == 0 || !tmp) {
            return [null, null];
        }
        //Getting bits from bitmap
        let ids = GetBits(tmp)
        return [ids, result_key];
    },
    regenerateStorageStructure: async (map) => {
        let resultSet = new Set();
        await client.sendCommand(['FLUSHALL']);
        for (let e of map) {
            
            for (let i = 0; i < e.length; i++) {
                if (i == 0) {
                    await client.lPush('type_' + e[i], e.slice(1, e.length));
                    await client.setBit('typeD_' + e[i], 0, 0);
                }
                else {
                    resultSet.add(e[i]);
                    await client.setBit(e[i], 0, 0)
                }
            }
        }
        return Array.from(resultSet);
    },
    regenerateStorageContent: async ({ map, device_props, device_types }) => {
        if (device_props) {
            for ({ dataValues } of device_props) {
                if (map.includes(dataValues.val)) {
                    await client.setBit(dataValues.val, dataValues.deviceId, 1);
                }
            }
        }
        if (device_types) {
            for ({ dataValues } of device_types) {
                await client.setBit('typeD_' + dataValues.typeId, dataValues.id, 1)
            }
        }
    },
    getRedisTypes: async () => {
        let data = await client.keys('type_*');
        let res = [];
        for (el of data) {
            let tmp = await client.lRange(el, 0, -1);
            res.push([el.replace('type_', ''), ...tmp]);
        }
        return res;
    }
}



module.exports = filterWorker;


//SELECT array_agg("deviceId") FROM Device_infos GROUP BY "title" , "textPart";