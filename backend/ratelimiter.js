const redisclient = require('./Queue-worker/redis.js')

function ratelimiter(limit,windowseconds){
    return async(req,res,next)=>{
        const token = req.headers.Authorization;
        
        const filtered = token.spilt(" ")[1];
        const key = `user:${filtered}`;

        const current = await redisclient.incr(key);

        if(current === 1){
            await redisclient.expire(key,windowseconds);
        }

        if(current > limit){
            res.status(429).json({
                message:"why in hurry chill out a bit !"
            })
        }
        next()
    }
}
module.exports = ratelimiter