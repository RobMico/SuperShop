import client from '../redisClient';
import uuid from 'uuid';
import redisCacheControl from './redisCacheControl';
import Logger from './logger';
const logger = Logger(module);
import { commandOptions } from 'redis';
//import { set } from '../db';

//let client = require('../redisClient');
//const uuid = require('uuid');
//const redisCacheControl = require('../utils/redisCacheControl');
//const logger = require('../utils/logger')(module);




class FilterWorker {
    lockTypeUpdate = false;
    unlockTypeUpdate = [];
    GetBits(bytes) {
        let ids = [];
        for (let i = 0; i < bytes.length; i++) {        // iterate in bytes (8 products at once)
            for (let j = 7; j >= 0; j--) {              // iterate over bits in current 8-products chunk                
                if (bytes[i] & (1 << j)) {              // >0 if bit was 1, otherwise 0
                    ids.push((8 * i + (8 - j)) - 1);    // convenient when there are comments?
                }                                       // unfortunately I can't write like this(.
            }
        }
        return ids;
    }

    async addType(typeId: number) {
        await client.lPush(('type_' + typeId), []);
        await client.setBit(('typeD_' + typeId), 0, 0);
    }

    async addFilter(typeId: number, prop: string, device_ids: number[]) {
        await client.lRange(('type_' + typeId), 0, -1);
        const typeProps = await client.lRange(('type_' + typeId), 0, -1);
        if (!typeProps.includes(prop)) {
            await client.lPush(('type_' + typeId), prop);
        }

        for (const id of device_ids) {
            await client.setBit(prop, id, 1);
        }

        if (device_ids.length == 0) {
            await client.setBit(prop, 1, 0);
        }
    }

    async editFilter(previous: string, newVal: string, id: number) {
        previous && await client.setBit(previous, id, 0);
        newVal && await client.setBit(newVal, id, 1);
        return true;
    }

    async getFilters(typeId: number) {
        //result should be like:
        //title:'color_red', count:1...
        //note that color_red can be of different types, so we have to use bitOp(AND) with type bitmap and count ids of certain type


        //If this data cached, load from cache
        let cache = <string>await client.get(`*_type${typeId}Props`);//redis get returns buffer only if it is directly set in arguments
        if (cache) {
            try {
                logger.info("getFilters;loading cache");
                return JSON.parse(cache);
            }
            catch (ex) {
                logger.error("getFilters;Loading cache error", ex);
            }
        }


        let stored = <string[]>await client.lRange(('type_' + typeId), 0, -1);//always return string[]
        let result = [];
        for (const e of stored) {
            if (e) {//sometimes there are empty lines
                try {
                    let uniqueKey = "*_" + uuid.v4();
                    await client.bitOp('AND', uniqueKey, [('typeD_' + typeId), e]);
                    const count: number = await client.bitCount(uniqueKey);
                    result.push({ str: e, count: count })
                } catch { }
            }
        }
        await client.set(`*_type${typeId}Props`, JSON.stringify(result));//cashing
        return result;
    }




    
    async addDevice(props, deviceId: number, typeId: number) {
        let stored = await client.lRange(('type_' + typeId), 0, -1);
        await client.setBit(('typeD_' + typeId), deviceId, 1);

        props.forEach(e1 => {
            let tmp = e1.title + '_' + e1.textPart;
            stored.forEach(e2 => {
                if (tmp == e2) {
                    client.setBit(e2, deviceId, 1)
                }
            })
        });
        return true;
    }

    // async checkType(typeId: number) {
    //     if (!this.lockTypeUpdate) {
    //         this.lockTypeUpdate = true;

    //         let tmp = await client.lRange(('type_' + typeId), 0, -1);
    //         let set = new Set(tmp);

    //         await client.del(('type_' + typeId));
    //         await client.lPush(('type_' + typeId), [...set]);


    //         for (const e of this.unlockTypeUpdate) {
    //             await e();
    //         }
    //         this.unlockTypeUpdate = [];
    //         this.lockTypeUpdate = false;
    //         return true
    //     }
    //     else {
    //         this.unlockTypeUpdate.push(async () => {
    //             let tmp = await client.lRange(('type' + typeId), 0, -1)
    //             let set = new Set(tmp);
    //             await client.del(('type' + typeId))
    //             await client.lPush(('type' + typeId), [...set])
    //         })
    //     }
    // }


    //create bitmap for new type


    async getIds(filters, resultKey, typeId: number) {
        if (!filters || filters.length == 0) {//exit if no filters
            return;
        }
        if (resultKey) { //if such a request has been executed before, load it
            let cache = await client.get(commandOptions({ returnBuffers: true }), resultKey);
            if (cache) {
                logger.info("getIds;loading from cache");
                let ids = this.GetBits(cache);
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


        if (!tmp) {
            return [null, null];
        }
        //Getting bits from bitmap
        let ids = this.GetBits(tmp)
        return [ids, result_key];
    }
    async regenerateStorageStructure(map) {
        let resultSet = new Set();
        await client.sendCommand(['FLUSHALL']);
        for (const e of map) {

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
    }
    async regenerateStorageContent({ map, device_props, device_types }) {
        if (device_props) {
            for (const { dataValues } of device_props) {
                if (map.includes(dataValues.val)) {
                    await client.setBit(dataValues.val, dataValues.deviceId, 1);
                }
            }
        }
        if (device_types) {
            for (const { dataValues } of device_types) {
                await client.setBit('typeD_' + dataValues.typeId, dataValues.id, 1)
            }
        }
    }
    async getRedisTypes() {
        let data = <string[]>await client.keys('type_*');
        let res = [];
        for (const el of data) {
            let tmp = await client.lRange(el, 0, -1);
            res.push([el.replace('type_', ''), ...tmp]);
        }
        return res;
    }
}

export default new FilterWorker();