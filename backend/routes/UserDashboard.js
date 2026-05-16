const epxress=require("express")
const Order=require("../schema/order")
const user = require("../schema/user")

const router= express.Router()

router.get("/dashboard",async(req,res)=>{
    const totalOrder= await Order.countDocuments({
        user:req.user.id
    })
    const pendingOrder= await Order.countDocuments({
        user:req.userid,
        status:"Pending"
    })
    const deliveredOrder=await Order.countDocuments({
        user:req.user._id,
        status:"Delivered"
    })
    const recentOrder= await Order.find({
        user:req.userid
    }).sort({createdAt:-1}).limit(5)
    res.status(200).json({
        "totalOrder":totalOrder,
        "pendingOrder":pendingOrder,
        "deliveredOrder":deliveredOrder,
        "recentOrder":recentOrder
    })
})
module.exports=router