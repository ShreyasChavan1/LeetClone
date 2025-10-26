require('dotenv').config();
const Ioredis = require("ioredis");

const redisConnection = new Ioredis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null
});

module.exports = redisConnection;
