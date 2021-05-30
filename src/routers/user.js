const express=require('express');
const sharp=require('sharp');
const User=require('../models/user');
const auth=require('../middleware/auth');
const {sendWelcomeMail,sendCancellationMail}=require('../emails/accounts');
const multer=require('multer');




const router=new express.Router();




router.post('/users/login',async(req,res)=>{

    try{
    const user=await User.findByCredentials(req.body.email,req.body.password);
    const token=await user.assigntoken();
    res.send({user,token});
    }catch(e)
    {
        res.status(400).send(e);
    }
  
})

router.post('/users',async (req,res)=>{
    const user=new User(req.body);
   
    
    try{
         await user.save();
         sendWelcomeMail(user.email,user.name);
         const token=await user.assigntoken();
         res.status(201).send({user,token});
    }catch(e){
        res.status(400).send();
    }
   
    
})
router.post('/users/logout',auth,async (req,res)=>{
    try{

        req.user.tokens=req.user.tokens.filter((token)=>{
            token.token!==req.token;
           
        })
        await req.user.save(); 
        res.send();
    }catch(e){
        res.status(401).send();
    }
})

router.post('/users/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})


router.get('/users/me',auth,async (req,res)=>{
   
    try{
    
    res.send(req.user);
    }catch(e){
        res.status(401).send(e);
    }
})


router.patch('/users/me',auth,async (req,res)=>{

    const allowedUpdates=['name','age','email','password'];
    const updates=Object.keys(req.body);

    const  canupdate=updates.every((update)=>{
        return allowedUpdates.includes(update);
    })

    if(!canupdate)
    {
        return res.status(404).send("Error: Update not allowed");
    }

    try{

        updates.forEach((update)=>{
            req.user[update]=req.body[update];
            
        })
        await req.user.save();
        res.send(req.user);

    }catch(e){
        res.status(500).send();
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    
    try{
        req.user.remove();
        
        sendCancellationMail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
})






const upload=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.jpg'))
        {
            return cb(new Error('Please upload a jpg file'))
        }
        cb(undefined,true);
    }
    
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=sharp(req.file.buffer).png().resize({width:250,height:250}).toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send(`${error}`)
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
    const user=await User.findById(req.params.id);
    if(!user||!user.avatar)
    {
        throw new Error();
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar);
    }catch(e)
    {
        res.status(404).send();
    }   

})
module.exports=router;