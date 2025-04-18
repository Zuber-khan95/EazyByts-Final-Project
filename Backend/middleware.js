import ExpressError from "./ExpressError.js";
import { eventSchema } from "./validate.js";

const isLoggedIn=(req,res,Next)=>{
    if(!req.isAuthenticated()){ 
return Next( new ExpressError(401,"You must be signed in first!"));
    }
    Next();
};

const isOwner=async(req,res,Next)=>{
try{
    const event=await Event.findById(req.params.id).populate("owner");
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

const isValidEvent=async(req,res,next)=>{

    try{
    
        const eventValidate=await eventSchema.validateAsync(req.body);
        if(eventValidate){
            next();
        }
    }
        catch(err)
        {
            console.error("Error:", err); 
            next(new ExpressError(501,"Validation Error occured"));
        }
    }


export {isLoggedIn,isOwner,isValidEvent};