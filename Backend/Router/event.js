import express from 'express'
const router=express.Router();
import Event from '../Model/event.js'
import Ticket from '../Model/ticket.js'
import ExpressError from '../ExpressError.js';
import {isLoggedIn,isOwner,isValidEvent} from '../middleware.js'
import { eventSchema } from '../validate.js'
import { upload } from '../cloudConfig.js'
import {v2 as cloudinary} from 'cloudinary';

router.post("/new",isLoggedIn,upload.single("image"),async(req,res,next)=>{
        try{ 
          
            if (req.body.price && typeof req.body.price === "string") {
                req.body.price = JSON.parse(req.body.price);
              }
              
              if (req.body.availableTickets && typeof req.body.availableTickets === "string") {
                req.body.availableTickets = JSON.parse(req.body.availableTickets);
              }
                const validateEvent=await eventSchema.validateAsync(req.body);
            if(!validateEvent){
                next( new ExpressError(404,"Validation Error occured"));
            }
              const newEvent=new Event(req.body);
                      if(req.file)
                      {
                        newEvent.image=req.file.path;
                        newEvent.imagePublishedId=req.file.filename;
                      }
                        newEvent.owner=req.user._id;
                        const savedEvent = await newEvent.save();
            if(!savedEvent){
                throw new ExpressError(404,"Unable to add this event");
            }
            res.json({state:"success", message:"Successfully Added the Event"});
                }
                catch(err)
                {
                    console.error("Error:", err); 
                    next(new ExpressError(500,"internal server error")); 
                }

    });

    router.get("/:id",async(req,res,next)=>{
        let {id}=req.params;
        try{
            const event=await Event.findById(id);
            if(!event){
                throw new ExpressError(404,"Unable to find this event");
            }
            const tickets = await Ticket.find({ event: event._id });

    const bookedSeats = {
      diamond: [],
      gold: [],
      silver: []
    };

    tickets.forEach(ticket => {
      ticket.seatNo.forEach(seat => {
        bookedSeats[ticket.ticketType].push(seat);
      });
    });
            res.json({event,bookedSeats});
        }
        catch(err)
        {
            console.error("Error:", err); 
            next(new ExpressError(500,"internal server error"));
        }
    });
router.get("/",async(req,res,next)=>{
    try{
const data= await Event.find({}).populate("owner");

if(!data){
    throw ExpressError(404,"Unable to fetch events");
}
res.json(data);
    }
    catch(err)
    {
        console.error("Error:", err); 
        next(new ExpressError(500,"internal server error"));
    }
});



router.delete("/:id",isLoggedIn,isOwner,async(req,res,next)=>{
    
    let {id}=req.params;
    try{
        const event=await Event.findById(id);
        if(!event){
            throw new ExpressError(404,"Unable to find this event");
        }
        let imagePublicId=event.imagePublishedId;
    if(imagePublicId){
        const result = await cloudinary.uploader.destroy(imagePublicId);  
        if (result.result !== 'ok' && result.result !== 'not found') {
            return next(new ExpressError(500, "Unexpected error deleting image from Cloudinary"));
        }
    } 
      const deletedEvent=await Event.findByIdAndDelete(id);
if(!deletedEvent){
    throw ExpressError(404,"Unable to delete this event");
}
res.json({state:"success", message:"Successfully Deleted the Event"});
    }
    catch(err)
    {
        console.error("Error:", err); 
        next(new ExpressError(500,"internal server error"));
    }
});


export default router;

