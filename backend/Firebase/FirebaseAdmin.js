const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    storageBucket:"bhai-f58f8.appspot.com"
})

module.exports = admin;