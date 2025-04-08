 import axios from 'axios'
 import {useAuth} from "../context/AuthContext";
 import React, { useEffect,useState } from 'react'
 axios.defaults.withCredentials=true;
 import Card from '../components/Card.jsx'
 import Button from "react-bootstrap/Button"
 import DeleteIcon from '@mui/icons-material/Delete';
 import { useFlash } from '../context/FlashContext.jsx';
 import { handleAxiosError } from '../utils/handleAxiosError';
 import './Cart.css'

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
        {flash.success && <p style={{color:"green"}}>{flash.success}</p>}
        {flash.error && <p style={{color:"red"}}>{flash.error}</p>}
{
    user?<h3 style={{textAlign:"left"}}>Welcome <u>{user.username}</u> in the Cart...</h3>:<h3>Welcome Guest in the cart..</h3>
}
    <div className='Outer'>
        {
            events.map((event)=>(
                <div key={event._id} className="inner">
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