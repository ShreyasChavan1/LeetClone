const express = require("express");
const app = express();
const cors = require('cors');
const port = 4000;
const mongose = require("mongoose");
const problem = require("./models/newprob");

require("dotenv").config();
mongose.connect(process.env.MONGO_URI)
.then(()=> console.log("connected to mangoose database !"))
.catch(err => console.error("there is an error ",err));

app.use(cors());
app.use(express.json());

const problems = [];

app.get('/Problems', (req, res) => {
    res.json(problems);
});

app.get('/Problem/:title',(req,res) => {
    const problem = problems.find(p => p.title === parseInt(req.params.title));
    if(problem) res.json(problem);
    else res.status(404).json({error:"problem not found"})
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

app.listen(port,()=>console.log(`backend is listening on port ${port}...`));



