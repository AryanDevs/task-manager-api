const jwt=require('jsonwebtoken');
const User=require('../models/user');
const auth=(async (req,res,next)=>{
try{

    const token=req.header('Authorization').replace('Bearer ','');
    const vpay=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findOne({_id:vpay._id,'tokens.token':token});
    if(!user)
    {
        throw new error();
    }
    req.user=user;
    req.token=token;
    next();

}catch(e){
    res.status(401).send("Unable to authorize");
}
})

module.exports=auth;