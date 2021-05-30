const mongoose=require('mongoose')
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new error("Email is invalid");
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
            

            if(value.includes('password'))
            throw new error("Password must not include 'password' in it");
        }
    },
    age:{
        type:Number,
        default:18,
        valdator(value)
        {
            if(value<18)
            throw new error("User must be 18 years or older");
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
});

UserSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


UserSchema.statics.findByCredentials=async(email,password)=>{
    
    
    const user=await User.findOne({email});
    if(!user)
    {
        throw new error("Unable to login");
    }
    const allow=await bcryptjs.compare(password,user.password);
    if(!allow)
    {
        throw new error("Unable to login");
    }  

    return user;
}

UserSchema.pre('save',async function (next){

    const user=this;
    if(user.isModified('password'))
    {
        user.password=await bcryptjs.hash(user.password,8);
    }
    next();

})

UserSchema.methods.assigntoken=async function(){

    const token=await jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET);
    const user=this;
    user.tokens=user.tokens.concat({token});
    user.save();
    return token;
}

UserSchema.methods.toJSON= function(){
    const user=this;
    const userobject=user.toObject();

    delete userobject.tokens;
    delete userobject.password;
    delete userobject.avatar;

    return userobject;
}

const User= mongoose.model('User',UserSchema);

module.exports=User;