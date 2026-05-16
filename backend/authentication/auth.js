const express=require("express")
const jwt=require("jsonwebtoken")
const bycrpt=require("bycrpt")
const User=require("../schema/user")
const router=express.Router()
router.post("/signup",async(req,res)=>{
    const{name,email,password,role}=req.body
    const finduser= await User.findOne({
        email:email
    }) 
    if (finduser){
        return res.status(409).send("User already exist")
    }
    const hashpassword= await bycrpt.hash(password,10)

    const user= await User.create({
        name:name,
        email:email,
        password:hashpassword,
        role:role

    })
    const token= await jwt.sign(
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
router.post("login",async(req,res)=>{
    const {email,password,role}=req.body
    const finduser= await User.findOne({email})
    if (!finduser){
        return res.status(404).send("User not found")
    }
    const compare= await bycrpt.compare(password,finduser.password)
    if (!compare){
        return res.status(401).send("Incorrect password")
    }
    const token= await jwt.sign(
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