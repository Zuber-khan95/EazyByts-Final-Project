import express from 'express';
import mongoose from 'mongoose'
const router = express.Router();
import Event from '../Model/event.js';
import Ticket from '../Model/ticket.js';
import User from '../Model/user.js';
import ExpressError from '../ExpressError.js';
import { isLoggedIn, isOwner, isValidEvent } from '../middleware.js';

router.post("/new/:eventId/:userId",isLoggedIn, async (req, res, next) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    
    let {eventId,userId}=req.params;
    let {quantity,price,ticketType,ticketDate,seatNo}=req.body;

    try {

       

        const date = new Date(`${ticketDate}T18:30:00.000Z`);
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
            ticketDate,
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
        event.bookedSeats[`${ticketType}`].push(...seatNos);

        event.owner.balance += price;
        user.balance -= price;

        

        
        await newTicket.save();
       const updatedUser= await user.save();
        await event.save();
        await event.owner.save();
     
     
      

        res.json({ state: "success", message: "Successfully purchase the ticket",user:updatedUser });
    } catch (err) {
        console.error("Error:", err);
        // await session.abortTransaction();
        // session.endSession();
        // console.error("Transaction error:", err);
        next(err);
    }
});

export default router;