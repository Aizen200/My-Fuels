const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
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
}
module.exports=authMiddleware