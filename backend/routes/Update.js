const express=require("express")
const Order=require("../schema/order")
const router=express.Router()
router.patch("/orders/:id/status",async(req,res)=>{
    const{status}=req.body
    const{id}=req.params
    const updateOrder=await Order.findByIdAndUpdate(
        id,
        {status:status},
        {new:true}
    )
    res.status(200).json({updateOrder})
})
module.exports=router