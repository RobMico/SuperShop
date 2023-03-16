import client from '../redisClient';
import * as uuid from 'uuid';
import logger from './logger';
import { commandOptions } from 'redis';
import DeviceInfoDto from '../dto/Device/DeviceInfoDto';
import RedisCacheController from './RedisCacheController';
import { GetPropToDeviceKey, GetTypePropsCacheKey, GetTypePropsKey } from './RedisKeyNamesWorker';

interface getIdsResultObject {
    result_key: string;
    ids: number[];
}

interface getTypeFilters {
    str: string;
    count: number;
}

class FilterWorker {
    async GetAllKeys() {
        logger.info('');
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
        logger.info('add type', typeId);
        await client.lPush(GetTypePropsKey(typeId), []);
        await client.setBit(GetPropToDeviceKey(typeId), 0, 0);
    }

    async addFilter(typeId: number, propKey: string, device_ids: number[]) {
        logger.info('addFilter', [typeId, propKey]);
        const typeProps = await client.lRange(GetTypePropsKey(typeId), 0, -1);
        if (!typeProps.includes(propKey)) {
            await client.lPush(GetTypePropsKey(typeId), propKey);
        }

        for (const id of device_ids) {
            await client.setBit(propKey, id, 1);
        }

        if (device_ids.length == 0) {
            await client.setBit(propKey, 1, 0);
        }
    }

    async editFilter(previousKey: string, newValKey: string, deviceId: number) {
        logger.info('addFilter', [previousKey, newValKey, deviceId]);
        previousKey && await client.setBit(previousKey, deviceId, 0);
        newValKey && await client.setBit(newValKey, deviceId, 1);
        return true;
    }

    async getFilters(typeId: number, count: boolean = true): Promise<getTypeFilters[] | string[]> {
        //result should be like:
        //[{title:'color_red', count:1}, {title:'size_big', count:10}, ...]
        //note that color_red can be of different types, so we have to use bitOp(AND) with type bitmap and count ids of certain type

        //If this data cached, load from cache
        if (count) {
            let cache = <string>await client.get(GetTypePropsCacheKey(typeId));//redis get returns buffer only if it is directly set in arguments
            if (cache) {
                try {
                    logger.info('addFilter, cahce', [typeId]);
                    return JSON.parse(cache);
                }
                catch (ex) {
                    logger.error("getFilters, cahce parse error", ex);
                }
            }


            let stored = <string[]>await client.lRange(GetTypePropsKey(typeId), 0, -1);//always return string[]
            let result = [];
            for (const e of stored) {
                if (e) {//sometimes there are empty lines
                    let uniqueKey = "*_" + uuid.v4();
                    await client.bitOp('AND', uniqueKey, [GetPropToDeviceKey(typeId), e]);
                    const count: number = await client.bitCount(uniqueKey);
                    RedisCacheController.addTempKey(uniqueKey);
                    result.push({ str: e, count: count })
                }
            }
            logger.info('addFilter, recreate cache', [typeId]);
            await client.set(GetTypePropsCacheKey(typeId), JSON.stringify(result));//cashing result
            return result;
        }
        else {
            const typeProps = <string[]>await client.lRange(GetTypePropsKey(typeId), 0, -1);
            return typeProps;
        }
    }

    async addDevice(props: DeviceInfoDto[], deviceId: number, typeId: number) {
        //get all filters on this type
        logger.info('', [deviceId]);
        let storedFilters = await client.lRange(GetTypePropsKey(typeId), 0, -1);
        //set device on type list
        await client.setBit(GetPropToDeviceKey(typeId), deviceId, 1);
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
                let ORKeyName = "*_" + filters[i];
                concated[i] = ORKeyName;
                //check cache                
                let isStored = await client.exists(ORKeyName);
                if (isStored) {
                    //logger.info("getIds;loading from cache filters");
                    continue;
                }
                else {//if no cache
                    await client.bitOp('OR', ORKeyName, filters[i]);
                    RedisCacheController.addCacheKey(ORKeyName);
                }
            }
        }

        if (typeId) {//apply typeId filter if require
            concated.push(GetPropToDeviceKey(typeId));
        }

        //["color_blue,color_red" AND "RAM_16" AND "" AND ...] => Bitmap
        let result_key = "*_" + uuid.v4();
        await client.bitOp('AND', result_key, concated);//executing AND op for concated

        let resultBitmap = await client.get(commandOptions({ returnBuffers: true }), result_key)
        RedisCacheController.addTempKey(result_key);

        if (!resultBitmap) {
            return null;
        }
        //Getting bits from bitmap
        let ids = this.GetBits(resultBitmap);
        return { result_key, ids };
    }

    async getRedisStorageMap() {
        //All types and their props for recreating
        //format:
        // [
        //     [typeId, prop1, prop2, prop3, ....]
        //     [ (typeId)'1', 'color_green', 'color_blue', 'color_red' ],
        // ]

        logger.warn('Get redis map');
        let types: string[] = await client.keys('type_*');
        let res: string[][] = [];
        for (const type of types) {
            let tmp: string[] = await client.lRange(type, 0, -1);
            res.push([type.replace('type_', ''), ...tmp]);
        }
        return res;
    }

    async regenerateStorageStructure(map: string[][]) {
        logger.warn('Regenerating redist structure', [map]);
        let resultSet = new Set();
        await client.sendCommand(['FLUSHALL']);//Clear redis
        for (const typeArr of map) {
            for (let i = 0; i < typeArr.length; i++) {
                if (i == 0) {
                    await client.lPush('type_' + typeArr[0], typeArr.slice(1, typeArr.length));
                    await client.setBit('typeD_' + typeArr[0], 0, 0);
                }
                else {
                    resultSet.add(typeArr[i]);
                    await client.setBit(typeArr[i], 0, 0)
                }
            }
        }
        return Array.from(resultSet);
    }


    async regenerateStorageContent({ map, device_props, device_types }) {
        logger.warn('regenerate storage content', [map, device_props, device_types]);
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