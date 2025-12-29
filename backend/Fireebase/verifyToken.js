const admin = require("./FirebaseAdmin");
const jwt = require('jsonwebtoken')
const SECRET = "4ea5087a7e36ffee5077fd0c0cf0a4405f70ead0b5c35fec1b3e3feef4596a9ab542335a06c44e78841a9892b5c4dbfb9a07364ce18f298286dbbc3a168a9627"
async function verifytoken(req, res, next) {

    if(req.cookies?.auth_token){
        try{
            const decoded = jwt.verify(req.cookies.auth_token,SECRET)
            req.user = decoded;
            return next();
        }catch{

        }
    }
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "unauthorized" });
    }
 
    const token = authheader.split(" ")[1]?.trim();
    try {
        const decoded = await admin.auth().verifyIdToken(token);

        const jwttoken = jwt.sign({
            uid:decoded.uid,
            email:decoded.email,
        },SECRET,{expiresIn:"1h"});

        res.cookie("auth_token",jwttoken,{
            httpOnly:true,
            secure:false,
            maxAge: 60 * 60 * 1000
        })

        req.user = {uid:decoded.uid,email:decoded.email};
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "invalid token" });
    }
}

module.exports = verifytoken;
