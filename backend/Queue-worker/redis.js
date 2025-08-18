const Ioredis = require("ioredis");

const reddisconection = new Ioredis({
    host:"127.0.0.1",
    port:6379,
    maxRetriesPerRequest: null
})
module.exports = reddisconection;