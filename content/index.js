const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()
const Content = require("./content")
const multer = require("multer")
const csv = require("csvtojson")
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(cors({
    origin:["http://0.0.0.0","https://0.0.0.0","http://localhost:3000","http://127.0.0.1:3000/"]
}))
app.use(express.static(path.resolve(__dirname,'public')));
if (!fs.existsSync('./public/csv')) {
    fs.mkdirSync('./public/csv', { recursive: true });
}
const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
    cb(null,'./public/csv');  
    },  
    filename:(req,file,cb)=>{  
    cb(null,file.originalname);  
    }  
    });  
const uploads = multer({storage:storage});
mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    },()=>{console.log("connected to pratilipi-content")})
app.get('/test',(req,res)=>{
    res.send("hello")
})
app.post('/content/update', async (req,res)=>{
    const {ContentID,change} = req.body
    var data = await Content.findById(ContentID)
    if (data) {
        data.Likes+=change
        data.save()
        return res.json({message:"Likes Updated",data:data.Likes})
    }else{
        return res.json({error:"Content Not Found",data:null})
    }

})

app.post('/content',async (req,res)=>{
    const {userID} = req.body
    // console.log(await Content.find({},{createdAt:0,updatedAt:0,__v:0, _id:0}).sort({Likes:-1}).skip(0).limit(10));
    var data = await Content.find({},{createdAt:0,updatedAt:0,__v:0}).sort({Likes:-1})
    const response = await fetch("http://user:5000/user/listliked",{
                                    method : 'post',
                                    headers: {'Content-Type':'application/json'},
                                    body: JSON.stringify({
                                        'userID':userID,
                                    })
                                })
    var liked = await response.json()
    return res.json({message:"Contents recieved Successfully",content:data,liked:liked})
})
app.post('/content/upload',uploads.single('csv'),(req,res)=>{  
    var arr = []
    var message = ''
    csv()  
    .fromFile(req.file.path)  
    .then((jsonObj)=>{
    Content.insertMany(jsonObj,{'ordered':false}, (err, result) => {
        if (err){
            if (err.name == "MongoBulkWriteError") {
                err.writeErrors.forEach(element => {
                    arr.push(element.err.op.Title)
                });
                message = "Some Data Not Imported Due to Title Duplicacy."
            }else{
                console.log(err);
                message = "CSV Import Failed"
                return res.json({error:message,data:arr})
            }
            return res.json({message:message,data:arr})
        }
        else{
            console.log("Imported CSV into database successfully.");
            message = "Imported CSV into database successfully."
            return res.json({message:message,data:arr})
        }
    });
})
})

app.listen(PORT,()=>{console.log(`Listening to port ${PORT}`)})
