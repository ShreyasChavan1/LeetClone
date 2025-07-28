const express = require("express");
const app = express();
const cors = require('cors');
const port = 4000;
const mongose = require("mongoose");
const problem = require("./models/newprob");
const runner = require("../runner")



require("dotenv").config();
mongose.connect(process.env.MONGO_URI)
.then(()=> console.log("connected to mangoose database !"))
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

app.post('/run',async(req,res)=>{
  try{
    const {code,language } = req.body;

    const result = await runner(code,language);
    res.json(result);
  }catch(err){
    res.status(400).json({err:"something went wrong"})
  }
})
app.listen(port,()=>console.log(`API is listening on port ${port}...`));



