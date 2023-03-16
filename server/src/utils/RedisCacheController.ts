import client from '../redisClient';
import logger from './dbLogger';

class RedisCacheController {
    cacheKeysStack: string[];
    tempKeysStack: string[];

    maxTempKeysCount: number = 10;
    maxCacheKeysCount: number = 200;

    async addTempKey(key: string) {
        logger.info('temp key', [key]);
        this.tempKeysStack.push(key);
        if (this.tempKeysStack.length > this.maxTempKeysCount) {
            await client.del(this.tempKeysStack.shift());
        }
    }

    async addCacheKey(key: string) {
        logger.info('cache key', [key]);
        this.cacheKeysStack.push(key);
        if (this.cacheKeysStack.length > this.maxCacheKeysCount) {
            await client.del(this.cacheKeysStack.shift());
        }
    }

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

}

export default new RedisCacheController();