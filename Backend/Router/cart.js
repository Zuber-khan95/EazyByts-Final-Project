import express from 'express';
import User from '../Model/user.js';
import Event from '../Model/event.js';
import ExpressError from '../ExpressError.js';
import { isLoggedIn } from '../middleware.js';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
const router=express.Router();

router.get("/:userId",isLoggedIn,async(req,res,next)=>{
  let {userId}=req.params;
    try{
const CartEvents=await User.findById(userId).populate("Events");
if(!CartEvents){
    throw new ExpressError(404,"User's Event not found");
}
res.json({CartEvents});
    }
    catch(err)
    {
        console.error("Error:", err); 
        next(new ExpressError(500,"internal server error"));
    }

});

router.post("/:eventId/:userId",isLoggedIn,async(req,res,next)=>{
    let {eventId,userId}=req.params;
    try{
const event=await Event.findById(eventId);

if(!event)
{
    throw new ExpressError(404,"Event not found");
}
const user=await User.findById(userId);
if(!user)
{
     new ExpressError(404,"User not found");
}

if(!((event.owner.equals(user._id))||(user.Events.includes(eventId)))){
    user.Events.push(event);
const savedUser=await user.save();
res.json({state:"success", message:"Successfully Added the Event with User"});
}

    next( new ExpressError(403,"You are already added this event into your cart or You are the owner."));
}

    catch(err)
    {
        console.error("Error:", err); 
        next(new ExpressError(500,"internal server error"));
    }
});

router.delete("/:eventId/:userId",isLoggedIn,async(req,res,next)=>{
    let {eventId,userId}=req.params;
    try{
const event=await Event.findById(eventId);
if(!event)
{
    throw new ExpressError(404,"Event not found");
}
const user=await User.findById(userId);
if(!user)
{
    throw new ExpressError(404,"User not found");
}
user.Events.pop(event);
const savedUser=await user.save();
res.json({state:"success", message:"Successfully delete the Event."});
    }
    catch(err)
    {
        console.error("Error:", err); 
        next(new ExpressError(500,"internal server error"));
    }
});
export default router;