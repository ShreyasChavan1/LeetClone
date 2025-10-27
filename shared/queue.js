const {Queue} = require("bullmq");
const reddisconection = require("./redis")
const subqueue = new Queue("submissionqueue",{connection:reddisconection});

module.exports = subqueue;