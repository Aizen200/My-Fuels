const express=require("express")
const Order=require("../schema/order")
const router=express.Router()
router.get("/search",async(req,res)=>{
    const{orderNumber}=req.query
    const findOrder= await Order.findOne({
        orderNumber
    }).populate("user").populate("fuel")
    res.status(200).json({
        findOrder
    })
})
module.exports=router