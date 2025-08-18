const {Worker} = require("bullmq");
const mongoose = require("mongoose");
const oursubmission = require("../models/submissionmode");
const getcode = require("../Fireebase/getfromFirebase");
const runner = require("../../runner");
const reddisconection = require("./redis")
const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Worker connected to MongoDB"))
.catch(err => console.error("Error while worker connecting to MongoDB:", err));



const worker = new Worker("submissionqueue",
    async(job) => {
        const {submissionId} = job.data;
        console.log(`Processing submission: ${submissionId}`);
        
        try {
            const ourdoc = await oursubmission.findById(submissionId);
            if(!ourdoc){
                throw new Error(`Submission ${submissionId} not found in database`);
            }

            const fileurl = ourdoc.getfireurl;
            const lang = ourdoc.language;
            const name = ourdoc.prob;
            
            console.log(`Fetching code from: ${fileurl}`);
            const ourcode = await getcode(fileurl);
            
            console.log(`Running code for problem: ${name}, language: ${lang}`);
            const result = await runner(ourcode, lang, name);

            // Update submission with results
            ourdoc.status = result.verdic || result.verdic || "Error";
            ourdoc.result = result.useroutput || result.output || JSON.stringify(result);
            await ourdoc.save();
            
            console.log(`Submission ${submissionId} completed with status: ${ourdoc.status}`);
            return result;
            
        } catch(err) {
            console.error(`Error processing submission ${submissionId}:`, err);
            
            // Try to update submission with error status
            try {
                const ourdoc = await oursubmission.findById(submissionId);
                if(ourdoc) {
                    ourdoc.status = "Error";
                    ourdoc.result = err.message || "Unknown error occurred";
                    await ourdoc.save();
                }
            } catch(updateErr) {
                console.error("Failed to update submission with error status:", updateErr);
            }
            
            throw err;
        }
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
