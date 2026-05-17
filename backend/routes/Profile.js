const express=require("express")
const User=require("../schema/user")
const router= express.Router()
const authMiddleware=require("../middleware/authmiddleware")

router.get("/:name",authMiddleware,async(req,res,next)=>{
    try {
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
    } catch (error) {
        next(error)
    }
})

module.exports=router