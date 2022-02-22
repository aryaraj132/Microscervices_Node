
const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    LikedBy:{
        type:String,
        required:true,
    },
    ContentID:{
        type:String,
        required:true,
    },
}
);

module.exports = Likes = mongoose.model("likes",LikeSchema)