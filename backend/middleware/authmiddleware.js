const signupmiddleware=(req,res,next)=>{
    const{name,email,password}=req.body
    if(!name ||! email || !password){
        return res.status(400).send("All the fields required")
    }
    if (!email.includes("@")){
        return res.status(400).send("Invalid email")
    }
    next()
}
const loginmiddleware=(req,res,next)=>{
    const{email,password}=req.body 
    if (!email || !password){
        return res.status(400).send("All the fields required")

    }
    if (!email.includes("@")){
        return res.status(400).send("Invalid email")
    }
    next()
}
module.exports={loginmiddleware,signupmiddleware}