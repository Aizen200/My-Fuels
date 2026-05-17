const express=require("express")
const Order=require("../schema/order")
const router=express.Router()
router.get("/dashboard",async(req,res)=>{
    const totalOrder=await Order.countDocuments()
    const pendingOrder=await Order.countDocuments({
        status:"Pending"
    })
    const outfordelivery=await Order.countDocuments({
        status:"Out for Delivery"
    })
    const deliveredOrder=await Order.countDocuments({
        status:"Delivered"
    })
    res.status(200).json({
        totalOrder,
        pendingOrder,
        outfordelivery,
        deliveredOrder
    })
})
module.exports= router