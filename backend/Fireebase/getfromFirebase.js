const admin = require("./FirebaseAdmin");
const fs = require("fs");
async function Extractfromfile(filename){
    const tempfile = `${__dirname}/${Date.now()}-${filename.split("/").pop()}`;
    fs.writeFileSync(tempfile,"")
    try{
        const bucket = admin.storage().bucket();
        await bucket.file(filename).download({destination:tempfile});
        console.log("downloaded submitted file for");
        let output;
        output = fs.readFileSync(tempfile, "utf8");
        fs.unlinkSync(tempfile);
        return output
    }catch(err){
        console.error("error downloading file",err);
        throw err;
    }
}

module.exports = Extractfromfile;