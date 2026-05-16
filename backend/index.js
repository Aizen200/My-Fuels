const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")
const e = require("express")
dotenv.config()
const app= express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.Mongo_url)
.then(()=>{console.log("MongoDB Connected")})
.catch((err)=>console.log(err))
app.get("/",(req,res)=>{
    res.send("Project setup")
})
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server is running")
})