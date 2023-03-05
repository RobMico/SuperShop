//const redis = require("redis");
//const dataLogger = require('./utils/dataLogger');
import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  }
});

//TODO: logging
export default client;
