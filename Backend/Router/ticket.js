import express from 'express';
import mongoose from 'mongoose'
const router = express.Router();
import Event from '../Model/event.js';
import Ticket from '../Model/ticket.js';
import User from '../Model/user.js';
import ExpressError from '../ExpressError.js';
import  {ticketSchema}  from "../validate.js"
import { isLoggedIn } from '../middleware.js';

router.post("/new/:eventId/:userId",isLoggedIn, async (req, res, next) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    
    let {eventId,userId}=req.params;
    let {quantity,price,ticketType,ticketDate,seatNo}=req.body;

    try {
    
        if(quantity!==seatNo.length) {
           throw new ExpressError(400, "Quantity and seat number length do not match");
        }
      
        const event = await Event.findById(eventId).populate("owner");
        if (!event) {
            throw new ExpressError(404, "Unable to find this event");
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new ExpressError(404, "Unable to find this user");
        }
        if(price>user.balance) {
            throw new ExpressError(400, "Insufficient balance");
        }
       
        const newTicket = new Ticket({
            event: event._id,
            user: user._id,
            ticketType,
            quantity,
            price,
          date: new Date(ticketDate),
            seatNo
        });

const seatNos=seatNo.map(seat=>parseInt(seat,10));
const maxSeats = event.availableTickets[`${ticketType}`] || 0;
const alreadyBooked = event.bookedSeats[`${ticketType}`] || [];

const duplicates = seatNos.filter(seat => alreadyBooked.includes(seat));
if (duplicates.length > 0) {
  throw new ExpressError(400,`Seats already booked: ${duplicates.join(', ')}`);
}

if (seatNos.length > maxSeats) {
  throw new ExpressError(400, `Only ${maxSeats} ${ticketType} seats are available`);
}

const outOfRange = seatNos.filter(seat => seat < 1 || seat > maxSeats+alreadyBooked);
if (outOfRange.length > 0) {
  throw new ExpressError(400,`Invalid seat numbers: ${outOfRange.join(', ')}`);
}
        event.availableTickets[`${ticketType}`] -= quantity;
        user.purchaseTickets.push(newTicket._id);
        event.owner.ordersPlaced.push(newTicket._id);
        event.bookedSeats[`${ticketType}`].push(...seatNos);

        event.owner.balance += price;
        user.balance -= price;
      
/// it will remove Event from Events Array when you are puchasing that eevent's ticket
        if(user.Events.includes(eventId))
        {
            const eventIndex=user.Events.indexOf(eventId);
        user.Events.splice(eventIndex,1);
        }
        await newTicket.save();
       const updatedUser= await user.save();
        await event.save();
        await event.owner.save();
     
        res.json({ state: "success", message: "Successfully purchase the ticket", user:updatedUser});
    } catch (err) {
        console.error("Error:", err);
        // await session.abortTransaction();
        // session.endSession();
        // console.error("Transaction error:", err);
        next(err);
    }
});

router.patch("/:ticketId/:userId",isLoggedIn,async(req,res,next)=>{
    const {ticketId,userId}=req.params;
    try{
const ticket=await Ticket.findById(ticketId).populate("event").populate({path:'event',populate:{path:'owner',select:'username balance ordersPlaced'}});
if(!ticket){
    throw new ExpressError(404,"Unable to find the ticket");
}
const user=await User.findById(userId);
if(!user){
    throw new ExpressError(404,"Unable to find the user");
}
const isTicketOwner=user.purchaseTickets.includes(ticketId);
if(!isTicketOwner)
{
    throw new ExpressError(403,"You are unable to do it beacuse you are not the owner of ticket");
}

if(ticket.status==="active"){
ticket.status="cancelled";
user.balance+=ticket.price;
ticket.event.owner.balance-=ticket.price;
ticket.event.availableTickets[`${ticket.ticketType}`]+=ticket.quantity;

const seatsToCancel = [...ticket.seatNo]; // Clone to avoid mutation issues

for (const seat of seatsToCancel) {
  // Remove from ticket.seatNo
  const index = ticket.seatNo.indexOf(seat);
  if (index !== -1) {
    ticket.seatNo.splice(index, 1);
  }

  // Remove from bookedSeats
  const bookedIndex = ticket.event.bookedSeats[ticket.ticketType].indexOf(seat);
  if (bookedIndex !== -1) {
    ticket.event.bookedSeats[ticket.ticketType].splice(bookedIndex, 1);
  }
}
//deleting the ticket from owner of event (ordersPlaced List)
const ordersPlacedIndex=ticket.event.owner.ordersPlaced.indexOf(ticketId);
if(ordersPlacedIndex!==-1)
{
    ticket.event.owner.ordersPlaced.splice(ordersPlacedIndex,1);
}
ticket.event.markModified(`bookedSeats.${ticket.ticketType}`);
await ticket.save();
await ticket.event.save();
await ticket.event.owner.save();
const updatedUser=await user.save();

res.json({status:200, state:"success", message:"Successfully cancelled the ticket", user:updatedUser });
}
else{
    throw new ExpressError(400,"Unable to cancel the non active tickets");
}
    }
    catch(err)
    {
        console.error("Error:", err);
        next(err);
    }
});

router.delete("/:ticketId/:userId",isLoggedIn,async(req,res,next)=>{
    let {ticketId,userId}=req.params;
    try{
        const ticket=await Ticket.findById(ticketId);
        if(!ticket)
        {
            throw new ExpressError(404,"Unable to find the ticket");
        }
        const user=await User.findById(userId);
        if(!user)
        {
            throw new ExpressError(404,"Unable to find the user");
        }

        const isTicketOwner=user.purchaseTickets.includes(ticketId);
          if(!isTicketOwner)
        {
           throw new ExpressError(403,"You are unable to do it beacuse you are not the owner of ticket");
        }

        if(ticket.status==="expired"||ticket.status==="cancelled")
        {
          for(let i=0;i<user.purchaseTickets.length;i++){
            if(user.purchaseTickets[i].equals(ticketId))
            {
        user.purchaseTickets.splice(i,1);
        break;
            }
        };


        const deletedTicket=await Ticket.findByIdAndDelete(ticketId);
        if(!deletedTicket){
            throw new ExpressError(404,"Unable to get the ticket to delete.");
        }
        const updatedUser= await user.save();
        res.json({state:"success", message:"Successfully deleted the ticket", user:updatedUser});
    }
        else{
throw new ExpressError(400,"You can not delete active ticket from dashboard");
        }
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
});

export default router;