const mongoose = require("mongoose")

const submissionschema = new mongoose.Schema({
    userid: { type: String, required: true }, // Firebase UID as string
    prob: { type: String, required: true }, // Problem name
    difficulty:{type:String,required:true,enum:["Easy","Medium","Hard"]},
    status: { type: String, enum: ["Completed","Running","Error","Pending","Failed"], default: "Pending" },
    verdict: {
        type: String,
        enum: ["Accepted", "Wrong Answer", "Error", "Time Limit Exceeded"],
        default: null
    },
    language: { type: String, required: true },
    getfireurl: { type: String, required: true }, // Firebase storage URL
    result: { type: String, default: "" }, // Execution result
    date: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Submission", submissionschema);
