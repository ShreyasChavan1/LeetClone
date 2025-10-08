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
const Redis = require('ioredis')

const http = require('http');
const {Server} = require('socket.io')
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }
})

//we subscribe to comman room for this particular userid
const subs = new Redis('redis')

subs.subscribe('submissionUpdates')
//you  left here , go to worker to connect publish to this room
subs.on('message',(channel,message)=>{
  const data = JSON.parse(message);
  const room = data.submissionId

  io.to(room).emit('jobUpdate',data)
})

io.on('connection',(socket)=>{
  console.log('user has connected to socket')

  socket.on('joinSubmission',(submissionId)=>{
    console.log(`client joined submission  room ${submissionId}`);
    socket.join(submissionId)
  })
})


require("dotenv").config();
mongose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to mongo database !"))
.catch(err => console.error("there is an error ",err));

app.use(cors());
app.use(express.json());


app.get('/Problems', verifytoken,async (req, res) => {
  try{
    const titles = await problem.find({});
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
    const {prob_name,frequency} = req.query;
    const useid = req.user.uid;
    let submissions;
    if (frequency === "Unique") {
      submissions = await submission.aggregate([
        {$match : {
          userid:useid,
          verdict:"Accepted"
                }},
        {$group:{
          _id:"$prob",
          difficulty:{$first:"$difficulty"}
        }},
        {$project:{
          _id:0,
          name:"$_id",
          difficulty:1
        }}
      ])
      // //give unique data based on problem names and user
    } else{
        if (!prob_name) {
            return res.status(400).json({ err: "prob_name is required when frequency is not Unique" });
          }
        const decoded_prob = decodeURIComponent(prob_name);
        submissions = await submission.find({ userid:useid, prob:decoded_prob });
    } 
    res.json(submissions);
  }catch(err){
    console.error("error in getting submission for user");
    res.status(500).json({err:"not get submissions"})
  }
}) 
app.get('/file/:filename/:bucketname',async(req,res)=>{
  try{
    const {filename,bucketname} = req.params
    const decodedfile = decodeURIComponent(filename);
    const decodedbucket = decodeURIComponent(bucketname);
    const filecontent = await getCode(decodedbucket,decodedfile);
    res.json(filecontent) 
  }catch(err){
    console.error("error in getting submissionfile",err);
    res.status(500).json({err:"not get files for frontend"})
  }
})

app.post('/post',async (req,res) => {
  try{
    const {update,problem_name} = req.query;
    const decoded = decodeURIComponent(problem_name);
    if(update == "True"){
      const updated = await problem.findOneAndUpdate(
        {title:decoded},
        req.body,
        {$new:true,overwrite:true}
      )
      if(!updated)return res.status(500).json({error:"Problem not found"})
      return res.status(200).json(updated)
    }
    const newproblem = new problem(req.body);
    await newproblem.save();
    res.status(200).json(newproblem);
  } catch (err) {
    res.status(500).json({ error: `Failed to update problem ${err}` });
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
    const {code,language,prob,difficulty} = req.body;
    const userid = req.user.uid;

    if (!code || !language || !prob) {
      return res.status(400).json({error: "Missing required fields: code, language, or problem"});
    }

    console.log("Code Stored to Supabase Storage")
    const subfile = `${Date.now()}-${userid}.${language}`;
    const getfireurl = await storage("Submissions",subfile,code);
    console.log("Submission document for current submission created")
    const sub = await submission.create({
      userid,
      prob,
      difficulty,
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
    io.to(sub._id.toString()).emit('jobUpdate',{
      submissionId:sub._id,
      status:"pending",
    })

    res.json({submissionID:sub._id});
  }catch(err){ 
    console.error("Error in submit route:", err);
    res.status(500).json({error: "Failed to process submission", details: err.message});
  }
})
server.listen(port,()=>console.log(`API is listening on port ${port}...`))
