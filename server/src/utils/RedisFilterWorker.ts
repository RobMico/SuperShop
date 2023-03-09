import client from '../redisClient';
import uuid from 'uuid';
import redisCacheControl from './redisCacheControl';
import Logger from './logger';
const logger = Logger(module);
import { commandOptions } from 'redis';
import DeviceInfoModel from '../models/DeviceInfoModel';
import DeviceInfoDto from '../dto/Device/DeviceInfoDto';
//import { set } from '../db';

//let client = require('../redisClient');
//const uuid = require('uuid');
//const redisCacheControl = require('../utils/redisCacheControl');
//const logger = require('../utils/logger')(module);

interface getIdsResultObject {
    result_key: string;
    ids: number[];
}


class FilterWorker {
    async GetAllKeys() {
        let data = await client.keys('*');
        return data;
    }
    GetBits(bytes: Buffer) {
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

    async addDevice(props: DeviceInfoDto[], deviceId: number, typeId: number) {
        //get all filters on this type
        let storedFilters = await client.lRange(('type_' + typeId), 0, -1);
        //set device on type list
        await client.setBit(('typeD_' + typeId), deviceId, 1);
        for (const prop of props) {
            let filter = prop.title + '_' + prop.textPart;
            if (storedFilters.includes(filter)) {
                await client.setBit(filter, deviceId, 1)
            }
        };
        return true;
    }

    async getIds(filters: (string[] | string)[], resultKey: string, typeId: number): Promise<getIdsResultObject> {
        //there are two operations in filters OR for same attribute and AND for different attributes
        //we gots it like [["color_blue" OR "color_red"] AND "RAM_16" AND ["" OR "" OR ""] ...]
        //so firstly we iterate through AND array and executing all OR op saving result keys to "concated",
        //then executing AND for concated

        if (resultKey) { //if such a request has been executed before, load it
            let cache = await client.get(commandOptions({ returnBuffers: true }), resultKey);
            if (cache) {
                let ids = this.GetBits(cache);
                return { result_key: resultKey, ids: ids };
            }
        }

        //[["color_blue" OR "color_red"] AND "RAM_16" AND ["" OR "" OR ""] ...]=>["color_blue,color_red" AND "RAM_16" AND "" AND ...]
        let concated: string[] = Array(filters.length);//AND Array
        for (let i = 0; i < concated.length; i++) {//executing OR ops
            if (!Array.isArray(filters[i])) {//if no OR op to execute - just store key
                concated[i] = filters[i].toString();
            }
            else {
                let ORKeyName = "*_" + filters[i]
                concated[i] = ORKeyName;
                //check cache                
                let isStored = await client.exists(ORKeyName)
                if (isStored) {
                    //logger.info("getIds;loading from cache filters");
                    continue;
                }
                else {//if no cache
                    await client.bitOp('OR', ORKeyName, filters[i])
                }
            }
        }

        if (typeId) {//apply typeId filter if require
            concated.push('typeD_' + typeId);
        }

        //["color_blue,color_red" AND "RAM_16" AND "" AND ...] => Bitmap
        let result_key = "*_" + uuid.v4();
        await client.bitOp('AND', result_key, concated);//executing AND op for concated

        let resultBitmap = await client.get(commandOptions({ returnBuffers: true }), result_key)


        if (!resultBitmap) {
            return null;
        }
        //Getting bits from bitmap
        let ids = this.GetBits(resultBitmap);
        return { result_key, ids };
    }
    
    async getRedisTypes() {
        let types: string[] = await client.keys('type_*');
        let res: string[][] = [];
        for (const type of types) {
            let tmp: string[] = await client.lRange(type, 0, -1);
            res.push([type.replace('type_', ''), ...tmp]);
        }
        return res;
    }


    async regenerateStorageStructure(map: any[]) {
        let resultSet = new Set();
        await client.sendCommand(['FLUSHALL']);//Clear redis
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

}

export default new FilterWorker();