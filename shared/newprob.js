const mongoose = require("mongoose");

const problemsschema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    difficulty:{type:String,required:true,enum:["Easy","Medium","Hard"]},
    description:{type:String,required:true},
    examples:[
        {
            input:String,
            output:String,
            explanation:String,
        }
    ],
    templates:{
        cpp:{type:String,required:true},
        python:{type:String,required:true},
        java:{type:String,required:true},
        js:{type:String,required:true}
    }

})

module.exports = mongoose.model("problems",problemsschema);