import Card from '../components/Card.jsx'
import {useState,useEffect} from 'react'
import axios from 'axios'
axios.defaults.withCredentials=true;
import './Home.css'
import Button from 'react-bootstrap/Button'
import {useFlash} from '../context/FlashContext.jsx'
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleAxiosError } from '../utils/handleAxiosError';
export default function Home(){
    let [events,setEvents]=useState([]);
    const {flash,updateFlash}=useFlash();
    const {user}=useAuth();
    const navigate=useNavigate();
let getData=async()=>{
    try{
const response=await axios.get("http://localhost:5000/event");
setEvents(response.data);
    }
    catch(err)
    {
        console.error("Error:",err.response?err.response.data.message:"server error")
    }
};

let handleDelete=async(id)=>{
    try{
        const response=await axios.delete(`http://localhost:5000/event/${id}`);
        if(response.data.state==="success"){
            updateFlash({success:"Successfully Deleted the Event"});
            setTimeout(()=>{
                updateFlash({success:""});
            },4000);
        }
       
    }
    catch(err)
    {
        const errorMsg=handleAxiosError(err);
        console.log(errorMsg.status);
    if(errorMsg.status==403){
        updateFlash({error:"You are not the owner to delete this event"});
        setTimeout(()=>{
            updateFlash({error:""});
        },4000);}
       else if(errorMsg.status==401){
            updateFlash({error:"You must be loggedIn to delete this event"});
            setTimeout(()=>{
                updateFlash({error:""});
            },4000);}
        
        else{
            updateFlash({error:`${errorMsg}`});
            setTimeout(()=>{
                updateFlash({error:""});
            },4000);
        }
      
    }
}

let handleCart=async(eventId)=>{
    try{
        const response=await axios.post(`http://localhost:5000/cart/${eventId}/${user._id}`);
        if(response.data.state==="success"){
            updateFlash({success:"Successfully Added the Event into cart."});
            setTimeout(()=>{
                updateFlash({success:""});
            },4000);
            setTimeout(()=>{
            navigate("/cart");
            },4000);
        }
       
    }
    catch(err)
    {
        updateFlash({error:"Unable to Add the Event into Cart"});
        setTimeout(()=>{
            updateFlash({error:""});
        },4000);
        console.error("Error:",err.response?err.response.data.message:"server error")
    
}
}
useEffect(()=>{
getData();
},[events]);

    return (
        <div>
  
    {flash.success && <p style={{color:"green"}}>{flash.success}</p>}
     {flash.error && <p style={{color:"red"}}>{flash.error}</p>}
<div className="Outer" >
{events.map((event)=>(
    
<div className="inner" key={event._id} >
<Card data={event}/>
<Button>Buy</Button> &nbsp;&nbsp;
{
    user&&<Button onClick={()=>{handleCart(event._id);}}>Add to cart</Button>
}

<p onClick={()=>{handleDelete(event._id);}} style={{textAlign:'right'}}> <DeleteIcon/></p>
</div>
)
    )};
    </div>
      </div>
    );
}