
const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true,
        unique:true
    },
    Story:{
        type:String,
        required:true
    },
    Published_At:{
        type:String,
        required:true
    },
    Likes:{
        type:Number,
        default:0
    }
},
{timestamps:true}
);

module.exports = Content = mongoose.model("content",ContentSchema)