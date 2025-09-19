const express = require("express");
const app = express();
const cors = require('cors');
const port = 4000;
const mongose = require("mongoose");
const problem = require("./models/newprob");
const verifytoken = require("./Fireebase/verifyToken")
const submission = require("./models/submissionmode")
const storage = require('./Supabase/storeTosupabase')
const getCode = require("./Supabase/getFromsupabase")
const subqueue = require("./Queue-worker/queue")

require("dotenv").config();

mongose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to mongo database !"))
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

app.get('/Getsubmissions',verifytoken,async(req,res)=>{
  try{
    const useid = req.user.uid;
    const submissions = await submission.find({userid:useid})
    res.json(submissions);
  }catch(err){
    console.error("error in getting submission for user");
    res.status(500).json({err:"not get submissions"})
  }
}) 
app.get('/file/:filename/:bucketname',async(req,res)=>{
  try{
    const {file,bucket} = req.params
    const decodedfile = decodeURIComponent(file);
    const decodedbucket = decodeURIComponent(bucket);
    const filecontent = await getCode(decodedbucket,decodedfile);
    res.json(filecontent) 
  }catch(err){
    console.error("error in getting submissionfile",err);
    res.status(500).json({err:"not get files for frontend"})
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
    const subdoc = await submission.findById(req.params.id);
    if(!subdoc)return res.json({error:"NO Submission exists"});

    return res.json({
      verdict:subdoc.verdict,
      status:subdoc.status,
      result:subdoc.result
    })
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

    console.log("Code Stored to Supabase Storage")
    const subfile = `${userid}-${Date.now()}.${language}`;
    const getfireurl = await storage("Submissions",subfile,code);
    console.log("Submission document for current submission created")
    const sub = await submission.create({
      userid,
      prob,
      status:"Pending",
      language,
      getfireurl,
      result: ""
    });
    
    console.log("Current Submission is being added to queue...")
    await subqueue.add("submissionqueue",{submissionId:sub._id},{
    removeOnComplete: 50, // keep only last 50 completed jobs
    removeOnFail: 100     // keep only last 100 failed jobs
  });

    res.json({submissionID:sub._id});
  }catch(err){ 
    console.error("Error in submit route:", err);
    res.status(500).json({error: "Failed to process submission", details: err.message});
  }
})
app.listen(port,()=>console.log(`API is listening on port ${port}...`))
