import express from 'express';
const app=express();
import { config } from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';    
import passportLocal from 'passport-local';
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
import mongoose from 'mongoose';
config();
import Event from './Model/event.js'
import event from "./Router/event.js";
import User from './Model/user.js';
import user from './Router/user.js';
import cart from './Router/cart.js'
import ExpressError from './ExpressError.js';
app.use(express.json());
const PORT= process.env.PORT||8000;
app.listen(PORT,(req,res,err)=>{
    console.log(`Server started at ${PORT}`);
});

mongoose.connect("mongodb://localhost:27017/BookMyEvent").then((res)=>{
    console.log("connected");
}).catch((err)=>{
    console.log("Not connected");
});


app.use((req,res,next,err)=>{
let {status=500,message="internalServerError"}=err;
res.status(status).send(message);
});

app.use(session({
    secret:process.env.SESSION_SECRET||"mysupersecretcode",
    resave:false,   
    saveUninitialized:false,
    Cookie:{
        expire:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        sameSite:true,
        secure:false                                        

    }
}));
passport.use(new passportLocal.Strategy(User.authenticate()));
app.use(passport.initialize());     
app.use(passport.session());
passport.serializeUser((User,done)=>{           
    done(null,User);
});
passport.deserializeUser((User,done)=>{
    done(null,User);
});
app.use("/event",event);
app.use("/",user);
app.use("/cart",cart);

