const express = require("express");
const app = express();
const cors = require('cors');
const port = 4000;
const mongose = require("mongoose");
const problem = require("./models/newprob");
const verifytoken = require("./Fireebase/verifyToken")
const submission = require("./models/submissionmode")
const storage = require("./Fireebase/uploadtoFirebase");
const subqueue = require("./Queue-worker/queue")

require("dotenv").config();

mongose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to mangoose database !"))
.catch(err => console.error("there is an error ",err));

app.use(cors());
app.use(express.json());


app.get('/Problems', async (req, res) => {
  try{
    const titles = await problem.find({},'title difficulty');
    res.json(titles);
  }catch(error){
    res.status(500).json({error:"unable to fetch data"});
  }
});

app.get('/Problem/:title',async(req,res) => {
  try{
    const titleparam = req.params.title;
    const decoded = decodeURIComponent(titleparam);
    const prob = await problem.findOne({title:decoded});
    if(prob) res.json(prob);
    else res.status(404).json({error:"problem not found"});
  }
  catch(err){
    res.status(500).json({err:"unable to fetch"});
  }
})  
   
app.post('/post',async (req,res) => {
  try{
    const newproblem = new problem(req.body);
    await newproblem.save();
    res.status(200).json(newproblem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update problem' });
  }
}) 

///here you left
app.get('/status/:id', async (req, res) => {
  try {
    const job = subqueue.getJob(req.params.id);
    if(!job)return res.json({error:"not job"});

    const state = await job.getState();
    let result = null;
    if(state == "completed"){
      result = job.returnvalue.result;
    }
    return res.json({state,result});
  } catch (err) {
    res.status(500).json({ err: 'no Submissionn exists' });
  }
}
)
app.post('/submit',verifytoken,async(req,res)=>{
  try{
    const {code,language,prob} = req.body;
    const userid = req.user.uid;

    if (!code || !language || !prob) {
      return res.status(400).json({error: "Missing required fields: code, language, or problem"});
    }

    const subfile = `${userid}-${Date.now()}.${language}`;
    const getfireurl = await storage(subfile,code);
    const sub = await submission.create({
      userid,
      prob,
      status:"Pending",
      language,
      getfireurl,
      result: ""
    });
    
    await subqueue.add("submissionqueue",{submissionId:sub._id});

    res.json({submissionID:sub._id});
  }catch(err){ 
    console.error("Error in submit route:", err);
    res.status(500).json({error: "Failed to process submission", details: err.message});
  }
})
app.listen(port,()=>console.log(`API is listening on port ${port}...`))
