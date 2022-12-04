let client = require('../redisClient');
const dataLoger = require('./dataLogger')
module.exports = {
    useCache:true,
    _storedFiltersConcats:[],
    _maxFiltersConcatsCapasity:3,
    cacheOptimizeByWeight:true,//TODO
    saveFilterConcat:async function (value) {        
        if(this._storedFiltersConcats.length>=this._maxFiltersConcatsCapasity)
        {
            let tmp=this._storedFiltersConcats.shift()            
            await client.del(tmp);
        }
        this._storedFiltersConcats.push(value);        
    },
    checkCache:async ()=>{
        let data = await client.keys('*');        
        dataLoger.warn("Redis keys:", data);
    },
    removeCache:async () => {
        let data = await client.keys('*');
        data.forEach(async e=>{
            if(e.includes("*_")||!e.includes("_"))
            {
                client.del(e);
            }
        })
        dataLoger.warn("Redis keys:", data);
    },
    clearRedisData:async ()=>{
        //SELECT id, typeId FROM DEVICES JOIN devices_info WHERE title+'_'+description in [values]  ???
        //typeId, deviceId, 
    },
    getAllKeys:async ()=>{
        let data = await client.keys('*');
        return data;
    },
}