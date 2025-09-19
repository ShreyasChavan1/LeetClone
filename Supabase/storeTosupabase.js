const supabase = require("./supabaseini")

async function uploadtosupabase(bucket,filename,code){
    const {data,error} = await supabase
    .storage
    .from(bucket)
    .upload(filename,Buffer.from(code),{
        contentType:"text/plain",
        upsert:true
    });

    if(error){
        throw new Error("supabase upload failed", error.message)
    }
    return filename;
}
module.exports = uploadtosupabase