 import axios from 'axios'
 import {useAuth} from "../context/AuthContext";
 import React, { useEffect,useState } from 'react'
 axios.defaults.withCredentials=true;
 import Card from '../components/Card.jsx'
 import Button from "react-bootstrap/Button"
 import DeleteIcon from '@mui/icons-material/Delete';
 import { useFlash } from '../context/FlashContext.jsx';
 import { handleAxiosError } from '../utils/handleAxiosError';
 import Alert from 'react-bootstrap/Alert';
 import './Cart.css'
 import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
 import { useNavigate } from 'react-router-dom';
 import Ticket from '../components/Ticket.jsx';
 import OrderTable from '../components/OrderTable.jsx';

 export default function Cart(){
    const navigate=useNavigate();
    const { user,updateUser }=useAuth();
    const [events,setEvents]=useState([]);
    const [orders,setOrders]=useState([]);
    const [tickets,setTickets]=useState([]);
    const {flash,updateFlash}=useFlash();

    let getData=async()=>{
        try{
const response=await axios.get(`http://localhost:5000/cart/${user._id}`);
setEvents(response.data.CartEvents.Events);
setOrders(response.data.CartEvents.ordersPlaced);
setTickets(response.data.CartEvents.purchaseTickets);
        }
        catch(err)
        {
            console.error("Error:",err.response?err.response.data.message:"Server error");
        }
    }

    useEffect(()=>{
        if(user)
        {
            getData();
        }  
    },[user]);

    let handleDeleteEventFromCart=async(eventId)=>{
        try{
const response=await axios.delete(`http://localhost:5000/cart/${eventId}/${user._id}`);
updateUser(response.data.user);
if(response.data.state==='success'){
updateFlash({success:"Successfully Deleted the Event From Cart"});
setTimeout(()=>{
    updateFlash({success:""});
},4000);
}

        }
        catch(err)
        {
           const errorMsg=handleAxiosError(err);
           console.log(errorMsg);
        }
    }
    if(!events){
        return (
            <div>Loading...</div>
        )
    }


    let handleBuyTicket=async(id)=>{
        try{
            const response=await axios.get(`http://localhost:5000/event/${id}`);
    if(user){
      if(user._id!==response.data.event.owner){
                    navigate(`/ticketForm/${id}`);
                }
                else{
                    updateFlash({error:"You are owner of this event so can't buy own event"});
                    setTimeout(()=>{
                        updateFlash({error:""});
                    },4000);
                }}
                else{
                    updateFlash({error:"You must be loggedIn to buy this event"});
                    setTimeout(()=>{
                        updateFlash({error:""});
                    },4000);
                }
        }
        catch(err){
            const errorMsg=handleAxiosError(err);
            console.log(errorMsg); 
        }  
    }

    let handleCancelTicket=async(ticketId)=>{
        try{
const response=await axios.patch(`http://localhost:5000/ticket/${ticketId}/${user._id}`);
updateUser(response.data.user);
if(response.data.state==="success")
{
    updateFlash({success:"Successfully cancelled the ticket"});
    setTimeout(()=>{
        updateFlash({success:""});
    },4000);
}
        }
        catch(err)
        {
            const errorMsg=handleAxiosError(err);
            updateFlash({error:errorMsg.statusText});
            setTimeout(()=>{updateFlash({error:""});
            },4000);
        }
    };

    let handleDeleteTicket=async(ticketId)=>{
    try{
const response=await axios.delete(`http://localhost:5000/ticket/${ticketId}/${user._id}`);
updateUser(response.data.user);

if(response.data.state==="success")
{
    updateFlash({success:"Successfully delete the ticket."});
    setTimeout(()=>{
        updateFlash({success:""});
    },4000);
}
    }
    catch(err){
const errorMsg=handleAxiosError(err);
console.log(errorMsg);
    }
    };
    console.log(orders);
return (
    <div>
             {flash.success &&  <Alert variant="success" onClose={() => updateFlash({success:""})} dismissible>
                              <Alert.Heading>Congratulation! You did it!</Alert.Heading>
                              <p>
                             {flash.success}
                              </p>
                            </Alert>}
                            {flash.error &&  <Alert variant="danger" onClose={() => updateFlash({error:""})} dismissible>
                              <Alert.Heading>Oh Snap! You got an error!</Alert.Heading>
                              <p>
                             {flash.error}
                              </p>
                            </Alert>}
{
    user?<span style={{textAlign:"left"}}>Welcome <u>{user.username}</u> in the Cart...</span>
    :<span>Welcome Guest in the cart..</span>
}
{
    user && <div style={{textAlign: "right",marginRight:"2px" }}><AccountBalanceWalletIcon/>:{user.balance}</div>
}
{events.length===0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>No Events Found in Cart</h2></div>}
  {events.length>0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>Events in Cart </h2></div>}
    <div className='Outer'>
        {
            events.map((event)=>(
                <div key={event._id} className="inner">
                     <img src={`${event.image}`} alt="event" ></img>
                    <Card data={event}/>
                    <Button onClick={()=>{handleBuyTicket(event._id)}}>Buy</Button>
                    <Button variant='danger' onClick={()=>{handleDeleteEventFromCart(event._id);}} style={{marginLeft:"5px"}}>Remove</Button>
                    </div>
            ))
        } ;
  </div>
  
    
    {tickets.length===0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>No Tickets Found</h2></div>}   
        {tickets.length>0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>Tickets </h2></div>}
        <div className='Outer'>
        {
         tickets.map((ticket)=>(
            <div key={ticket._id} className="ticket_background">
                <Ticket data={ticket}/>
            {ticket.status==="active" &&<Button variant='danger' onClick={()=>{handleCancelTicket(ticket._id);}}>Cancel Ticket</Button>}
            {(ticket.status==="expired"|| ticket.status==="cancelled") && <p onClick={()=>{handleDeleteTicket(ticket._id);}} 
                 style={{textAlign:'right'}}> <DeleteIcon/></p>}
            </div>
))  
        }
        </div>

    {orders.length===0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>No Orders Found</h2></div>}   
        {orders.length>0 && <div style={{textAlign:'center',marginTop:'20px',color:"purple"}}><h2>Orders </h2></div>}
        <div style={{width:"90%" ,marginLeft:"70px"}}>
            <OrderTable data={orders}/>
        </div>
    </div>
    
)}