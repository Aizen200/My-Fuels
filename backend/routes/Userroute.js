const express=require("express")
const Order=require("../schema/order")
const Fuel=require("../schema/fuel")
const authMiddleware=require("../middleware/authmiddleware")
const router= express.Router()

router.get("/fuels", authMiddleware, async(req, res) => {
    try {
        const fuels = await Fuel.find();
        res.status(200).json({ fuels });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
})

router.get("/dashboard",authMiddleware,async(req,res)=>{
    const totalOrder= await Order.countDocuments({
        user:req.user.id
    })
    const pendingOrder= await Order.countDocuments({
        user:req.user.id,
        status:"Pending"
    })
    const deliveredOrder=await Order.countDocuments({
        user:req.user.id,
        status:"Delivered"
    })
    const recentOrder= await Order.find({
        user:req.user.id
    }).sort({createdAt:-1}).limit(5)
    res.status(200).json({
        "totalOrder":totalOrder,
        "pendingOrder":pendingOrder,
        "deliveredOrder":deliveredOrder,
        "recentOrder":recentOrder
    })
})
router.get("/history",authMiddleware,async(req,res)=>{
    const OrderHistory=await Order.find({
        user:req.user.id
    })
    res.status(200).json({
        "OrderHistory":OrderHistory
    })
})
router.post("/orders", authMiddleware,async (req, res) => {

    try {

        const {
            preferredDeliveryTime,
            fuel,
            quantity,
            address,
            notes
        } = req.body;

        const fuelData = await Fuel.findById(fuel);

        if (!fuelData) {
            return res.status(404).json({
                message: "Fuel not found"
            });
        }

        const totalPrice =
            fuelData.pricePerLitre * quantity;
        const orderNumber =
            `MF-${Date.now()}`;
        const order = await Order.create({

            user: req.user.id,

            fuel,

            quantity,

            totalPrice,

            preferredDeliveryTime,

            notes,

            address,

            orderNumber

        });

        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports=router