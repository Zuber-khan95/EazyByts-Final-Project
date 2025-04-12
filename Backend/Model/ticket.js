import mongoose from 'mongoose'

const ticketSchema=new mongoose.Schema({
    order:{
        type:mongoose.Types.ObjectId,
        ref:"Order"
    },
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