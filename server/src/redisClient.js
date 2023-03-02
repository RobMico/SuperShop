const redis = require("redis");
const dataLogger = require('./utils/dataLogger');

const redisClient = {
  client:redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  }),
  connect: async function (){
    await this.client.connect();
  },
  call:function (method, ...params){
    dataLogger.info('Redis', {method:method, params:params})
    return this.client[method](...params);
  },
  del:function(...params){
    dataLogger.info('Redis', {method:'del', params:params})
    return this.client.del(...params);
  },
  keys:function(...params){
    dataLogger.info('Redis', {method:'keys', params:params})
    return this.client.keys(...params);
  },
  sendCommand:function(...params)
  {
    dataLogger.info('Redis', {method:'sendCommand', params:params})
    return this.client.sendCommand(...params);
  },
  lPush:function(...params)
  {
    dataLogger.info('Redis', {method:'lPush', params:params})
    return this.client.lPush(...params);
  },
  lRange:function(...params)
  {    
    dataLogger.info('Redis', {method:'lRange', params:params})
    return this.client.lRange(...params);
  },
  exists:function(...params)
  {
    dataLogger.info('Redis', {method:'exists', params:params})
    return this.client.exists(...params);
  },
  setBit:function(...params)
  {
    dataLogger.info('Redis', {method:'setBit', params:params})
    return this.client.setBit(...params);
  },
  bitCount:function(...params)
  {
    dataLogger.info('Redis', {method:'bitCount', params:params})
    return this.client.bitCount(...params);
  },
  bitOp:function(...params)
  {
    dataLogger.info('Redis', {method:'bitOp', params:params})
    return this.client.bitOp(...params);
  },
  get:function(...params)
  {
    dataLogger.info('Redis', {method:'get', params:params})
    return this.client.get(...params);
  },
  set:function(...params)
  {
    dataLogger.info('Redis', {method:'set', params:params})
    return this.client.set(...params);
  }
}


module.exports = redisClient
