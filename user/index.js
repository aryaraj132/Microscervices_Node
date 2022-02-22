const express = require("express")
const cors = require("cors")
const fetch = require("node-fetch")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const User = require("./users")
const Likes = require("./likes")
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors({
    origin:["http://0.0.0.0","https://0.0.0.0","http://localhost:3000","http://127.0.0.1:3000/"]
}))
mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    },()=>{console.log("connected to pratilipi-user")})
app.get("/test",(req,res)=>{
    res.send("hello")
})
app.post("/user/listliked", async (req,res)=>{
    const {userID} = req.body
    var data = await Likes.find({LikedBy:userID},{_id:0,LikedBy:0,__v:0})
    return res.json(data)
})

app.post("/user/updateliked", async (req,res)=>{
    const {LikedBy,ContentID} = req.body
    change = 0
    const user = await User.countDocuments({_id:LikedBy})
    if (user) {
        if(await Likes.findOne({LikedBy:LikedBy,ContentID:ContentID})){
            change = -1
            await Likes.deleteOne({LikedBy:LikedBy,ContentID:ContentID})
        }
        else{
            change=1
            var target = new Likes({LikedBy,ContentID})
            target.save()
        }
        const response = await fetch("http://content:4000/content/update",{
                                    method : 'post',
                                    headers: {'Content-Type':'application/json'},
                                    body: JSON.stringify({
                                        'ContentID':ContentID,
                                        'change':change
                                    })
    })
    return res.json(await response.json())
    }
    else{
        return res.json({error:"Invalid User"})
    }
})

app.post("/user/login", async (req,res)=>{
    const {email,password} = req.body
    if(!await User.countDocuments({email})){
        return res.json({error:"user does not exists"})
    }else{
        const user = await User.findOne({email})
        if (user.password === password){
            return res.json({message:"login successful",data:{id:user._id}})
        }
        return res.json({error:"password incorrect",data:null})
    }
})

app.post("/user/register", async (req,res)=>{
    const {username,email,password} = req.body
    if(await User.countDocuments({username}) || await User.countDocuments({email})){
        return res.json({error:"user already exists"})
    }else{
        const user = new User({username,email,password})
        user.save()
        return res.json({message:"new user created",data:{id:user._id}})
    }
})




app.listen(PORT,()=>{console.log(`Listening to port ${PORT}`)})
