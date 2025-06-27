const mongoose = require("mongoose");

const problemsschema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    difficulty:{type:String,required:true,enum:["Easy","Mediam","Hard"]},
    description:{type:String,required:true},
    examples:[
        {
            input:String,
            output:String,
            explaination:String,
        }
    ],
    testCases:[
        {
            input:String,
            output:String,
            hidden:{type:Boolean,default:false},
        }
    ]
})

module.exports = mongoose.model("problems",problemsschema);