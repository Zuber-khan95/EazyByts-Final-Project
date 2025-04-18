import express from 'express';
import passport from 'passport';        
import passportLocal from 'passport-local';
import User from '../Model/user.js';
import ExpressError from '../ExpressError.js';      
const router=express.Router();
import { Navigate } from 'react-router-dom';

router.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;
    
    try {
        if (!username || !email || !password) {
            throw new ExpressError(404,"Missing required fields");
        }
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            throw new ExpressError(409, "Username already taken"); 
        }
        const registeredUser = await User.register(new User({username,email}), password);
    
        if (!registeredUser) {
            throw new ExpressError(500,"Registration failed");
        }
              
        res.json({  message: "Registration successful" ,state:"success"});
    } catch (err) {
        console.error("Error:", err); 
        next(err);
    }
});

router.post("/login",passport.authenticate('local', {failureRedirect: './login'}),async(req,res,next)=>{
  try{
res.json({state:"success", user:req.user});
}
  catch(error)
  {
    console.error("Error:", err); 
        next(new ExpressError(500,"Internal Server Error"));
  }
});

router.post("/logout",(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("Error:", err); 
            next(new ExpressError(404,"Unable to logged out"));
        }
    });
    res.clearCookie('connect.sid');
    res.json({state:"success", message:"logged out"});


});


export default router;