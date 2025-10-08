const mongoose = require("mongoose")
const submissions = require("./models/submissionmode")
const url = "mongodb+srv://chavanshreyas120:Shre%409833@cluster0.g65egk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(url);
const delete_col = async()=>{
    await submissions.deleteMany({})
    .finally(()=>[console.log("done")])

}
delete_col();
