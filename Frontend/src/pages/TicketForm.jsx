import {Alert} from 'react-bootstrap';
import {useFlash} from '../context/FlashContext.jsx'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm , Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { ticketSchema } from '../../formValidation.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {useAuth} from '../context/AuthContext.jsx'
import {useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import { handleAxiosError } from '../utils/handleAxiosError.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function TicketForm() {
const navigate=useNavigate();
  const { register , handleSubmit, reset, watch, formState:{errors}, control}=useForm(
    {
    resolver:yupResolver(ticketSchema),
    defaultValues:{
      event: " ",
      user: " ",
      ticketType: "silver",
      quantity:1,
      price: "",
      ticketDate:"",
      seatNo:"",
    },
  });

  const selectedTicketType=watch("ticketType");
  const selectedQuantity=watch("quantity");
  const selectedDate=watch("ticketDate");
  const selectedSeatNo=watch("seatNo");
  const selectedPrice=watch("price");


  const { id } = useParams();
const [event,setEvent]=useState({});
const [bookedSeats,setBookedSeats]=useState([]);

const {user,updateUser}=useAuth();

const {flash,updateFlash}=useFlash();
useEffect(()=>{
  const getEvent=async()=>{   
    try{  
      if(id===undefined){
        updateFlash({error:"Event ID is not provided"});
        setTimeout(()=>{  
          updateFlash({error:""});
        },4000);
      }
      const response=await axios.get(`http://localhost:5000/event/${id}`); 
      setEvent(response.data.event);
      setBookedSeats(response.data.bookedSeats);
    }
    catch(err){
      const errorMsg=handleAxiosError(err);
      console.log(errorMsg);
    }
  };
  getEvent();
 
},[]);


useEffect(()=>{
  if(event.price && user.username){
    const totalPrice=selectedQuantity*event.price[selectedTicketType.toLowerCase()];

  if(selectedTicketType=="silver" && event.price && event.price.silver!==undefined){
    if(selectedQuantity>event.availableTickets.silver){
      updateFlash({error:"Not enough silver tickets available"});
      setTimeout(()=>{  
        updateFlash({error:""});
      },4000);
    }
    reset({
      event: event.title,
      user: user.username,
      ticketType: selectedTicketType,
      quantity: selectedQuantity,
      price: totalPrice,
      seatNo: selectedSeatNo,
      ticketDate: selectedDate,
    } );
    
  }
  else if(selectedTicketType=="gold" && event.price && event.price.gold!==undefined){
    if(selectedQuantity>event.availableTickets.gold){
      updateFlash({error:"Not enough gold tickets available"});
      setTimeout(()=>{  
        updateFlash({error:""});
      },4000);
    }
    reset({
      event: event.title,
      user: user.username,
      ticketType: selectedTicketType,
      quantity: selectedQuantity,
      price: totalPrice,
      seatNo: selectedSeatNo,
      ticketDate: selectedDate,
    } );
  }
  else if(selectedTicketType=="diamond" && event.price && event.price.diamond!==undefined){
    if(selectedQuantity>event.availableTickets.diamond){
      updateFlash({error:"Not enough diamond tickets available"});
      setTimeout(()=>{  
        updateFlash({error:""});
      },4000);
    }
    reset({
      event: event.title,
      user: user.username,
      ticketType: selectedTicketType,
      quantity: selectedQuantity,
      price: totalPrice,
      seatNo: selectedSeatNo,
      ticketDate: selectedDate,
    } );
  }
}
},[event,user,reset,selectedTicketType,selectedQuantity,selectedDate]);

const checkAvailability = () => {
  const seats = bookedSeats[`${selectedTicketType}`] || [];
if(selectedSeatNo.length!==parseInt(selectedQuantity)){
    updateFlash({ error: "Please select the same number of seats as the quantity" });
    setTimeout(() => updateFlash({ error: "" }), 4000);
    return false;
  }
  if (selectedSeatNo.length === 0) {
    updateFlash({ error: "Please select at least one seat" });
    setTimeout(() => updateFlash({ error: "" }), 4000);
    return false;
  }

    if(!(selectedDate && (selectedDate>event.startDate) && (selectedDate<event.endDate)) ){
      updateFlash({error:"Event is not present in this date"});
      setTimeout(()=>{
        updateFlash({error:""});
      },4000);
      return false;
      }
          if(selectedDate>event.endDate &&selectedDate<event.startDate){
            updateFlash({error:"Invalid date selected"});
            setTimeout(()=>{
              updateFlash({error:""});
            },4000);
            return false;
          }
          if(selectedPrice>user.balance)
          {
            updateFlash({error:"Insufficient balance.Add money in your wallet to Purchase Tickets."});
            setTimeout(()=>{
              updateFlash({error:""});
            },4000);
            return false;
          }

          const seatNo=selectedSeatNo.map(seat=>parseInt(seat,10));
          
          const duplicates = seatNo.filter(seat => bookedSeats[`${selectedTicketType}`].includes(seat));
          if (duplicates.length > 0) {
            updateFlash({error:`Seats already booked: ${duplicates.join(', ')}`});
            setTimeout(()=>{  
              updateFlash({error:""});
            },4000);
            return false;
          }

          const bookedSeatsCount = bookedSeats[`${selectedTicketType}`].length;
          const newTotal = bookedSeatsCount + seatNo.length;
          const maxSeats = event.availableTickets[`${selectedTicketType}`] || 0;
          if (seatNo.length > maxSeats) {
            updateFlash({error: `Only ${maxSeats - bookedSeatsCount} ${selectedTicketType} seats are available`});
            setTimeout(()=>{  
              updateFlash({error:""});
            },4000);
            return false;
          }
          
          const outOfRange = seatNo.filter(seat => seat < 1 || seat > event.availableTickets[`${selectedTicketType}`]+bookedSeatsCount);
          if (outOfRange.length > 0) {
          updateFlash({error:`Invalid seat numbers: ${outOfRange.join(', ')}`});
          setTimeout(()=>{  
            updateFlash({error:""});  

          },4000);
          return false;
          }

  return true; // All seats are valid
};


const onSubmit = async(formData)=>{
 const availability=checkAvailability();
  if(availability){
  try{
    const response=await axios.post(`http://localhost:5000/ticket/new/${event._id}/${user._id}`,formData);
updateUser(response.data.user);  
    if(response.data.state==="success"){
      reset();
      updateFlash({success:"Ticket purchased successfully"});
      setTimeout(()=>{  
        updateFlash({success:""});
      },4000);
      setTimeout(()=>{
        navigate("/cart");       
      },4000);
    }
  }
  catch(err){
    const errorMsg=handleAxiosError(err);
    updateFlash({error:"Internal Server Error"});
    setTimeout(()=>{
      updateFlash({error:''});
    },4000);
  }
  reset();

};
};


  if(!event){ 
    return( <div>Loading...</div>); 
  }
return(
     <div id="Form">
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
                <h3>Purchase Ticket from here</h3>
                 <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField label="Event Name" 
                         {...register("event")}
                        color="secondary" 
                        name='event'
                        type='text'
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!errors?.event}
                        helperText={errors?.event?.message}
                        focused />
                        <br />  <br />
                        <TextField label="User" 
                        {...register("user")}
                        color="secondary" 
                        name='user'
                         type='text'
                         InputProps={{
                          readOnly: true,
                        }}
                        error={!!errors?.user}
                        helperText={errors?.user?.message}
                        focused/>
                        <br />  <br />
                      <TextField label="No of tickets" 
                       {...register("quantity")}
                        color="secondary" 
                        name='quantity'
                        type='Number'
                        min="1"
                        error={!!errors?.quantity }
                        helperText={errors?.quantity?.message}
                        focused
                        />
                        <br />  <br />
                        <TextField
  label="Seat No(s)"
  {...register("seatNo", {
    setValueAs: value => {
      const stringValue = String(value); 
      return stringValue
        .split(',')
        .map(num => parseInt(num.trim(),10))
        .filter(num => !isNaN(num) && num > 0);
    }
  })}
  color="secondary"
  name='seatNo'
  type='text'
  placeholder="e.g. 3, 4, 5"
  error={!!errors?.seatNo}
  helperText={errors?.seatNo?.message || "Separate multiple seat numbers with commas"}
  focused
/>
                  <br/><br/>
                        <Controller
              name="ticketType"
              error={!!errors?.ticketType}
              helperText={errors?.ticketType?.message}
              control={control}
              render={({ field }) => (
    <FormControl>
      <FormLabel id="ticketType">Ticket type</FormLabel>
      <RadioGroup
      {...field}
      >
        <FormControlLabel value="diamond" control={<Radio />} label="Diamond" />
        <FormControlLabel value="gold" control={<Radio />} label="Gold" />
        <FormControlLabel value="silver" control={<Radio />} label="Silver" />
      </RadioGroup>
    </FormControl>)}/>
    <br /><br/>
    <TextField label="Price"
                         {...register("price")} 
                        color="secondary" 
                        name='price'
                        type='number'
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!errors?.price}
                        helperText={errors?.price?.message}
                        focused
                        />
                        <br/><br/>
                        <TextField label=" Ticket Date" 
                         {...register("ticketDate")}
                        color="secondary" 
                        name='ticketDate'
                        type='date'
                        error={!!errors?.ticketDate}
                        helperText={errors?.ticketDate?.message}
                        focused
                        />
                       <br/><br/>
                        <Button variant="contained" type='submit'>Buy the ticket</Button>
                       
                        </form>
            </div>
);
}
