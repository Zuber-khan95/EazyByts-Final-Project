import express from 'express'
const router=express.Router();
import Event from '../Model/event.js'
import ExpressError from '../ExpressError.js';

router.get("/",async(req,res,next)=>{
    try{
const data= await Event.find({});

res.json(data);
    }
    catch(err)
    {
        next(new ExpressError(500,"internal server error"));
    }
});

router.post("/new",async(req,res,next)=>{
    try{
        
const newEvent=new Event(req.body);
console.log(newEvent);
const savedEvent = await newEvent.save();
  
if(!savedEvent){
    throw new ExpressError(404,"Unable to add this event");
}
res.json({state:"success", message:"Successfully Added the Event"});
    }
    catch(err)
    {
        next(new ExpressError(500,"internal server error")); 
    }
});

router.delete("/:id",async(req,res,next)=>{
    
    let {id}=req.params;
    try{
       
const deletedEvent=await Event.findByIdAndDelete(id);


if(!deletedEvent){
    throw ExpressError(404,"Unable to delete this event");
}
res.json({state:"success", message:"Successfully Deleted the Event"});
    }
    catch(err)
    {
        next(new ExpressError(500,"internal server error"));
    }
});


export default router;

