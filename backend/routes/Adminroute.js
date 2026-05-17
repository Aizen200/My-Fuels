const express=require("express")
const Order=require("../schema/order")
const Fuel=require("../schema/fuel")
const User=require("../schema/user")
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
    const{orderNumber,filter}=req.query
    if (filter){
        const filterOrder=await Order.find({
            status:filter
        }).populate("user").populate("fuel")
        return res.status(200).json({filterOrder})
    }
    const findOrder= await Order.findOne({
        orderNumber
    }).populate("user").populate("fuel")
    return res.status(200).json({
        findOrder
    })
})
router.get("/vieworders",authMiddleware,rbac,async(req,res)=>{
    const allorders=await Order.find().populate("user").populate("fuel")
    res.status(200).json({
        allorders

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

router.get("/fuels", authMiddleware, rbac, async(req, res) => {
    try {
        const fuels = await Fuel.find();
        res.status(200).json({ fuels });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/fuels", authMiddleware, rbac, async(req, res) => {
    try {
        const { fuelName, pricePerLitre } = req.body;
        const newFuel = await Fuel.create({ fuelName, pricePerLitre });
        res.status(201).json({ fuel: newFuel });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/fuels/:id", authMiddleware, rbac, async(req, res) => {
    try {
        const { id } = req.params;
        const { fuelName, pricePerLitre } = req.body;
        const updatedFuel = await Fuel.findByIdAndUpdate(id, { fuelName, pricePerLitre }, { new: true });
        res.status(200).json({ fuel: updatedFuel });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/fuels/:id", authMiddleware, rbac, async(req, res) => {
    try {
        const { id } = req.params;
        await Fuel.findByIdAndDelete(id);
        res.status(200).json({ message: "Fuel deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/users", authMiddleware, rbac, async(req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/users/:id/role", authMiddleware, rbac, async(req, res) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { roles }, { new: true }).select("-password");
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/users/:id", authMiddleware, rbac, async(req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports= router