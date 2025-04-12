import mongoose from 'mongoose'
import passposrtLocalMongoose from 'passport-local-mongoose'
const userSchema=mongoose.Schema({
    "username":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true
    },
    "Events":[{ type: mongoose.Schema.Types.ObjectId,
        ref: 'Event' 
    }],
    "password":{
        type:String,
    },
    balance:{
        type:Number,
        default:0
    }
  
});

userSchema.plugin(passposrtLocalMongoose);
const User=mongoose.model('User',userSchema);   
export default User;