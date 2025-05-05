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
        enum:["diamond","gold","silver"],
        required:true
    },
    quantity:{
     type:Number,
     required:true,
     min:1
    },
    seatNo:{
        type:[Number],
        required:true,
        validate: {
            validator: function(value) {
                return value.every(seat => seat > 0); // Ensure all seat numbers are greater than 0
            },
            message: 'Seat numbers must be greater than 0'
        }
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["active","expired","cancelled"],
        default:"active",
    },
    date:{
        type:Date,
        default:new Date()
    },

});

const Ticket =mongoose.model("Ticket",ticketSchema);
export default Ticket;