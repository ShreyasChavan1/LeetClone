const fs = require("fs");
const supabase = require('./supabaseini');

async function getfromsupabase(bucket,filename){
    try{
        const { data, error } = await supabase.storage.from(bucket).download(filename);
        if (error) {
            throw new Error("Supabase download error: " + error.message);
        }
        const filebuffer = Buffer.from(await data.arrayBuffer());
        return filebuffer.toString("utf8");
    }catch(error){
        throw new Error("cannot get from supabase " + error.message);
    }
}
module.exports = getfromsupabase;
