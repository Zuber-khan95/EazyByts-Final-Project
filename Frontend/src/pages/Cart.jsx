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

 export default function Cart(){
    const { user }=useAuth();
    const [events,setEvents]=useState([]);
    const {flash,updateFlash}=useFlash();

    let getData=async()=>{
        try{
const response=await axios.get(`http://localhost:5000/cart/${user._id}`);
setEvents(response.data.CartEvents.Events);
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
    },[user,events]);

    let handleDelete=async(eventId)=>{
        try{
const response=await axios.delete(`http://localhost:5000/cart/${eventId}/${user._id}`);
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
                    <Button>Buy</Button>
                    <p onClick={()=>{handleDelete(event._id);}} 
                    style={{textAlign:'right'}}> <DeleteIcon/></p>
                    </div>
            ))
        } ;
    </div>
    </div>
)}