import ExpressError from "./ExpressError.js";
import { eventSchema } from "./validate.js";
import Event from "./Model/event.js";
import Ticket from "./Model/ticket.js"

const isLoggedIn=(req,res,Next)=>{
    if(!req.isAuthenticated()){ 
return Next( new ExpressError(401,"You must be signed in first!"));
    }
    Next();
};

const isOwnerOfEvent=async(req,res,Next)=>{
try{
    const event=await Event.findById(req.params.id).populate("owner");
    if(!event)
    {
        Next( new ExpressError(404,"event not found"));
    }
    if(event.owner._id==req.user._id){
  
      return Next();
     }
   return Next(new ExpressError(403,"You are not authorized to do this"));
}
catch(err)
    {
        console.error("Error:", err);
    Next(err);
}
  
}



export {isLoggedIn,isOwnerOfEvent};