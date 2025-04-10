import mongoose from 'mongoose';

const eventSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{      
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['Music','Sports','Others'],
        default:'Other'},
    
        status:{
            type:String,
            enum:['Scheduled','Ongoing','Completed'],
            default:'Scheduled'
        },
    startDate:{
        type:Date,
        
    },
    endDate:{
        type:Date,
        
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }


});

export default Event=mongoose.model('Event',eventSchema);
