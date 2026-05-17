const rbac=(req,res,next)=>{
    if(req.user.role !="admin"){
        return res.status(403).json("Acess denied")
    }
    next()
}
module.exports=rbac