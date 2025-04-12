import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    event:{
        type:mongoose.Types.ObjectId,
        ref:"Event"
    },
    tickets:{
        types:mongoose.Types.ObjectId,
        ref:"Ticket"
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String, 
        enum:["pending","confirmed","cancelled"],
        required:true
    },
    billingAddress:{
        line1:{type:String,required:true},
        line2:{type:String},
        city:{type:String,required:true},
        state:{type:String},
        zip:{type:String},
        country:{type:String,required:true}
    }
});

const Order=mongoose.model("Order",orderSchema);
export default Order;