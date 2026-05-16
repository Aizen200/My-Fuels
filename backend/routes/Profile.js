const express=require("express")
const User=require("../schema/user")
const router= express.Router()
router.get("/:name",async(req,res)=>{
    const{name}=req.params
    if (!name){
        return res.status(400).json({"err":"user does not exist"})
    }
    const user= await User.findOne({
        name:name
    })
    return res.status(200).json({
    "user":user
    })
})
module.exports=router