const express=require("express")
const Order=require("../schema/order")
const router=express.Router()
router.get("/history",async(req,res)=>{
    const OrderHistory=await Order.find({
        user:req.user.id
    })
    res.status(200).json({
        "OrderHistory":OrderHistory
    })
})
module.exports=router