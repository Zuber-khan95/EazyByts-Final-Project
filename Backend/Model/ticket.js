import mongoose from 'mongoose'

const ticketSchema=new mongoose.Schema({
    event:{
        type:mongoose.Types.ObjectId,
        ref:"Event"
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    ticketType:{
        type:String,
        enum:["daimond","gold","silver"],
        required:true
    },
    seatNo:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["active","used","cancelled"]
    }

});
const Ticket =mongoose.model("Ticket",ticketSchema);
export default Ticket;