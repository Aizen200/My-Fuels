const express=require("express")
const Order=require("../schema/order")
const authMiddleware=require("../middleware/authmiddleware")
const rbac=require("../middleware/rbac")
const router=express.Router()
router.get("/dashboard",authMiddleware,rbac,async(req,res)=>{
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
    const recentOrder=await Order.find().
    populate("user").populate("fuel").sort({createdAt:-1}).limit(5)
    res.status(200).json({
        totalOrder,
        pendingOrder,
        outfordelivery,
        deliveredOrder,
        recentOrder
    })
})
router.get("/search",authMiddleware,rbac,async(req,res)=>{
    const{orderNumber}=req.query
    const findOrder= await Order.findOne({
        orderNumber
    }).populate("user").populate("fuel")
    res.status(200).json({
        findOrder
    })
})
router.patch("/orders/:id/status",authMiddleware,rbac,async(req,res)=>{
    const{status}=req.body
    const{id}=req.params
    const updateOrder=await Order.findByIdAndUpdate(
        id,
        {status:status},
        {new:true}
    )
    res.status(200).json({updateOrder})
})
module.exports= router