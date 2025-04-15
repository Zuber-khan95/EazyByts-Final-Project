import express from 'express'
const router=express.Router();
import Event from '../Model/event.js'
import ExpressError from '../ExpressError.js';
import {isLoggedIn,isOwner,isValidEvent} from '../middleware.js'
import { eventSchema } from '../validate.js'
import { upload } from '../cloudConfig.js'

// router.post("/new", (req, res, next) => {
//     upload.single("image")(req, res, function (err) {
//         if (err) {
//             console.error("Multer error:", err);
//             return res.status(400).json({ message: "Upload failed", error: err.message });
//         }

//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         console.log("Upload success:", req.file.path);
//         res.status(200).json({ imageUrl: req.file.path });
//     });
// });

router.post("/new",isLoggedIn,async(req,res,next)=>{
    try{ 
            const newEvent=new Event(req.body);
            newEvent.owner=req.user._id;
            const savedEvent = await newEvent.save();
if(!savedEvent){
    throw new ExpressError(404,"Unable to add this event");
}
res.json({state:"success", message:"Successfully Added the Event"});
    }
    catch(err)
    {
        if (err.isJoi) {
            return next(new ExpressError(400, `Validation Error: ${err.message}`));
          }
        next(new ExpressError(500,"internal server error")); 
    }
});
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



router.delete("/:id",isLoggedIn,isOwner,async(req,res,next)=>{
    
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

