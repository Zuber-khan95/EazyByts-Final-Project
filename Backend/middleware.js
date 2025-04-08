import ExpressError from "./ExpressError.js";

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
    Next(err);
}
  
}

export {isLoggedIn,isOwner};