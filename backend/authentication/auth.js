const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt");
const User=require("../schema/user")
const router=express.Router()
const{signupmiddleware,loginmiddleware}=require("../middleware/validation")
router.post("/signup",signupmiddleware,async(req,res)=>{
    const{name,email,password}=req.body
    const finduser= await User.findOne({
        email:email
    }) 
    if (finduser){
        return res.status(409).send("User already exist")
    }
    const hashpassword= await bcrypt.hash(password,10)

    const user= await User.create({
        name:name,
        email:email,
        password:hashpassword

    })
    const token=  jwt.sign(
        { id:user._id,email:user.email},
     process.env.JWT,
     {expiresIn:"1h"}
)
    return res.status(201).json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        token
    })
})
router.post("/login",loginmiddleware,async(req,res)=>{
    const {email,password,role}=req.body
    const finduser= await User.findOne({email})
    if (!finduser){
        return res.status(404).send("User not found")
    }
    const compare= await bcrypt.compare(password,finduser.password)
    if (!compare){
        return res.status(401).send("Incorrect password")
    }
    const token=  jwt.sign(
        {id:finduser._id,email:finduser.email},
        process.env.JWT,
        {expiresIn:"1h"}
    )
    return res.status(200).json({
        id:finduser._id,
        email:finduser.email,
        name:finduser.name,
        token
    })
})
module.exports=router