import express from 'express';
import User from '../Model/user.js';
import Event from '../Model/event.js';
import ExpressError from '../ExpressError.js';
import { isLoggedIn } from '../middleware.js';
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
    throw new ExpressError(404,"User not found");
}
user.Events.push(event);
const savedUser=await user.save();
res.json({state:"success", message:"Successfully Added the Event with User"});
    }
    catch(err)
    {
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
        next(new ExpressError(500,"internal server error"));
    }
});
export default router;