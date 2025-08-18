// uploadFileToFirebase.js
const admin = require("./FirebaseAdmin");
const {v4:uuidv4} = require("uuid")


async function uploadTofirebase(filename,code){
    try{
        const bucket = admin.storage().bucket();
        const file = bucket.file(filename);
        const buffer = Buffer.from(code,'utf-8')

        const token = uuidv4();

        await file.save(buffer,{
            metadata:{
                contentType:"text/plain",
                metadata:{
                    firebaseStorageDownloadTokens:token
                }
            }
        })
        return filename;
    }
    catch(err){
        console.error("problem in seding file to firebase");
        throw err;
    }
}
module.exports = uploadTofirebase;