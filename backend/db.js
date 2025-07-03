const mongoose=require("mongoose")



module.exports.connect=()=>{
    mongoose.connect("mongodb+srv://noob212112b:j06w9felpZm4daxE@cluster6.trcr24q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster6").then(()=>{
        console.log("connected")
    })
}