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
        const registeredUser = await User.register(new User({username,email}), password);
        
        await new Promise((res, error) => {
            req.login(registeredUser, (err) => {
                if (err) return error(err);
                res();
            });
        });
        const safeUser = {
            id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email
        };
        
        res.json({ user: safeUser, message: "Registration successful" ,state:"success"});
    } catch (err) {
        if (err.name === 'UserExistsError') {
            return next(new ExpressError(500,"Username already taken"));
        }
        next(new ExpressError(500,"Registration failed"));
    }
});

router.post("/login",passport.authenticate('local', {failureRedirect: './login'}),async(req,res,next)=>{
  try{
res.json({state:"success", user:req.user});
console.log("logged in successfully");
}
  catch(err)
  {
    console.log(err);
    next(new ExpressError(500,"Internal Server Error"));
  }
});

router.post("/logout",(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            next(new ExpressError(404,"Unable to logged out"));
        }
    });
    res.clearCookie('connect.sid');
    res.json({state:"success", message:"logged out"});


});


export default router;