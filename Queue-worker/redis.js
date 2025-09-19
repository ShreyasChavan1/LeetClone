const Ioredis = require("ioredis");

const reddisconection = new Ioredis({
    host:"redis",
    port:6379,
    maxRetriesPerRequest: null
})
module.exports = reddisconection;