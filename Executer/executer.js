const express = require("express")
const app = express();
const cors = require("cors")
const runner = require("./runner")
app.use(cors());
app.use(express.json());

app.post("/run",async(req,res)=>{
    const {code,language,prob,subID} = req.body;
    try{
        const resu = await runner(code,language,prob,subID);
        res.json({resu})
    }catch(err){
        console.error("For exectuer here , Error in runner.js:", err);
        res.status(500).json({err:" Error while sending file to run from exectuer : "});
    }
})
app.listen(5000,()=>{
    console.log("Exectuer service listening to port 5000...")
})