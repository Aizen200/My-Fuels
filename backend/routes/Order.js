const express = require("express");
const Order = require("../schema/order");
const Fuel = require("../schema/fuel");

const router = express.Router();

router.post("/orders", async (req, res) => {

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

module.exports = router;