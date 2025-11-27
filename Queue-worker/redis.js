require('dotenv').config();
const Ioredis = require("ioredis");

const redisConnection = new Ioredis({
    host: 'redis',
    port: 6379,
    maxRetriesPerRequest: null
});

module.exports = redisConnection;
