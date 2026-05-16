const mongoose=require("mongoose")
const fuelSchema= new mongoose.Schema({
    fuelName:{
        type:String,
        required:true
    },
    pricePerLitre:{
        type:Number,
        required:true
    }
})
module.exports=mongoose.model("Fuel",fuelSchema)