import client from '../redisClient';
import Logger from './logger';
const logger = Logger(module);

class RedisCacheController {
    async clearCache() {
        let data = await client.keys('*');
        for (const key of data) {
            if (key.includes("*_") || !key.includes("_")) {
                await client.del(key);
            }
        };
    }

    async clearTempKeys() {
        let data = await client.keys('*');
        for (const key of data) {
            if (key.includes("*_") && !key.includes("type")) {
                await client.del(key);
            }
        };
    }

    constructor() {
        client.on('connect', this.clearTempKeys);
    }

    cacheKeysStack: string[];
    tempKeysStack: string[];

    maxTempKeysCount: number = 10;
    maxCacheKeysCount: number = 50;

    async addTempKey(key: string) {
        this.tempKeysStack.push(key);
        if (this.tempKeysStack.length > this.maxTempKeysCount) {
            await client.del(this.tempKeysStack.shift());
        }
    }

    async addCacheKey(key: string) {
        this.cacheKeysStack.push(key);
        if (this.cacheKeysStack.length > this.maxCacheKeysCount) {
            await client.del(this.cacheKeysStack.shift());
        }
    }
}

export default new RedisCacheController();