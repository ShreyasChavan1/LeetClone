const admin = require("./FirebaseAdmin");

async function verifytoken(req, res, next) {
    const authheader = req.headers.authorization;

    if (!authheader || !authheader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "unauthorized" });
    }
 
    const token = authheader.split(" ")[1]?.trim();

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "invalid token" });
    }
}

module.exports = verifytoken;
