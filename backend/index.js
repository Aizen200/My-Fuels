const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")
dotenv.config()
const app= express()
const authRoutes=require("./authentication/auth")
const profileRoute=require("./routes/Profile")
const userRoute=require("./routes/Userroute")
const adminRoute=require("./routes/Adminroute")
app.use(cors({
    origin: "https://my-fuels.vercel.app",
    credentials: true
}))
app.use(express.json())
app.use("/auth",authRoutes)
app.use("/profile",profileRoute)
app.use("/user",userRoute)
app.use("/admin",adminRoute)
mongoose.connect(process.env.Mongo_url)
.then(()=>{console.log("MongoDB Connected")})
.catch((err)=>console.log(err))
const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

app.listen(PORT,()=>{
    console.log("Server is running")
})