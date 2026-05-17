const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
    try {
        const authorization=req.headers.authorization
        if (!authorization){
            return res.status(401).json({
                "err":"No token provided"
            })
        }
        const token=authorization.split(" ")[1]
        const decode=jwt.verify(token,process.env.JWT)
        req.user=decode
        next()
    } catch (error) {
        return res.status(401).json({
            "err": "Invalid or expired token",
            "message": error.message
        })
    }
}
module.exports=authMiddleware