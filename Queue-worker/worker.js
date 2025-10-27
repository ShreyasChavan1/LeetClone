const {Worker} = require("bullmq");
const mongoose = require("mongoose");
const oursubmission = require("../shared/submissionmode");
const getcode = require("../shared/getFromsupabase");
const reddisconection = require("../shared/redis")
const axios = require("axios")
const Redis = require('ioredis')

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Worker connected to MongoDB Submissions Collection"))
.catch(err => console.error("Error while worker connecting to MongoDB:", err));


const pub = new Redis('redis');
const worker = new Worker("submissionqueue",
    async(job) => {
        const {submissionId} = job.data;
        console.log(`Worker has started Processing submission: ${submissionId}`);

        // let ourdoc = "";
        // let executionResult = null;

        // try {
        //     ourdoc = await oursubmission.findById(submissionId);
        //     if(!ourdoc){
        //         throw new Error(`Submission ${submissionId} not found in database`);
        //     }

        //     const fileurl = ourdoc.getfireurl;
        //     const lang = ourdoc.language;
        //     const name = ourdoc.prob;
        //     ourdoc.status = "Running"
        //     pub.publish("submissionUpdates",JSON.stringify({
        //         submissionId,
        //         status:ourdoc.status
        //     }))

        //     console.log(`Fetching code from: ${fileurl}`);
        //     const ourcode = await getcode("Submissions",fileurl);
            
        //     console.log(`Sending ${name} to exectuer at 5000 written on ${lang}`);
        //     const response = await axios.post('http://executer:5000/run',{
        //         code: ourcode,
        //         language: lang,
        //         prob: name,
        //         subID:submissionId
        //     })

        //     executionResult = response.data.resu;

        //     ourdoc.verdict = executionResult.verdict
        //     ourdoc.status = "Completed";
        //     ourdoc.result = executionResult.useroutput;
        //     if(!ourdoc.result)ourdoc.result = executionResult.RunTimeError;
        //     await ourdoc.save();
            
        //     pub.publish("submissionUpdates",JSON.stringify({
        //         submissionId,
        //         status:ourdoc.status,
        //         verdict:ourdoc.verdict,
        //         result:ourdoc.result
        //     }))


        //     console.log(`Submission ${submissionId} completed with status: ${ourdoc.status}`);
        //     return executionResult;

        // } catch(err) {
        //     console.error(`Error while running submission ${submissionId}:`, err);
        //     if (axios.isAxiosError(err) && err.response) {
        //         console.error('Axios Error Details:', {
        //             status: err.response.status,
        //             data: err.response.data,
        //             headers: err.response.headers,
        //         });
        //     }
        //     ourdoc.verdict = "Error";
        //     ourdoc.status = "Failed";
        //     ourdoc.result = executionResult ? executionResult.RunTimeError : "Error before execution";
        //     await ourdoc.save();
        //     pub.publish("submissionUpdates",JSON.stringify({
        //         submissionId,
        //         status:ourdoc.status,
        //         verdict:ourdoc.verdict,
        //         result:ourdoc.result
        //     }))
        //     // Return a simple object that can be serialized
        //     return { verdict: "Error", message: err.message, RunTimeError: executionResult ? executionResult.RunTimeError : "Unknown" };
        // }
    }, 
    {
        connection:reddisconection,
        concurrency:3
    },

);

worker.on("completed", (job) => {
    console.log(`Worker completed job ${job.id} for submission ${job.data.submissionId}`);
});

worker.on("failed", (job, err) => {
    console.error(`Worker failed job ${job.id}:`, err.message);
});

