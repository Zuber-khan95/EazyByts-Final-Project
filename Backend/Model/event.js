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
        type:Number,
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
    availableTickets:{
        type:Number,
        required:true,
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    image:{
        type:String,
    },

});

export default Event=mongoose.model('Event',eventSchema);
