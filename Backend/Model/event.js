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
        default:"https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/4d/94/1c/1a/84/v1_E10/E108AQ0F.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=7f65a117bb8bb877e1dc421a46bd79fd579d48474ee45780a0dbbf9e0415f466",
    },
    imagePublishedId:{
        type:String,
    },

});

export default Event=mongoose.model('Event',eventSchema);
