const mongoose=require("mongoose")
const orderSchema= new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    fuel:{
        type:mongoose.Types.ObjectId,
        ref:"Fuel",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    preferredDeliveryTime:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:[
            "Pending",
            "Accepted",
            "Out for Delivery",
            "Delivered"

        ],
        default:"Pending"
    },
    address:{
        type:String,
        required:true
    },
    notes:{
        type:String
    },
    orderNumber:{
        type:String,
        unique:true
    }
}, { timestamps: true })
module.exports = mongoose.model("Order", orderSchema);