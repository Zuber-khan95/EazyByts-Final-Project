import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useState} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useFlash } from '../context/FlashContext';
axios.defaults.withCredentials=true;
import { handleAxiosError } from '../utils/handleAxiosError';
import Alert from 'react-bootstrap/Alert';
import './AddEvent.css'
import {useForm,Controller} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { eventSchema } from '../../formValidation.js';


export default function AddEvent()
{
   

    const {register,control,reset,handleSubmit,formState:{errors}}=useForm({
        resolver:yupResolver(eventSchema),
        defaultValues:{
            title:"",
            description:"",
            location:"",
            price:"",
            availableTickets:"",
            category:"Music",
            status:"Scheduled",
            startDate:"",
            endDate:"",
    },});

    const {flash,updateFlash}=useFlash();

    const navigate=useNavigate();

    let onSubmit=async(formData)=>{
        try{
        const response=await axios.post("http://localhost:5000/event/new",formData);
        if(response.data.state==="success")
        {
            updateFlash({success:"Successfully Added the Event"});
            setTimeout(()=>{
                updateFlash({success:""});
            },4000);
                reset();
           setTimeout(()=>{
            navigate("/");
           },4000) ;
        }
      
        }
        catch(err)
        {
          const errorMsg=handleAxiosError(err);
          if(errorMsg==="Server Error occured"){

            updateFlash({error:"Unable to Add the Event"});
            setTimeout(()=>{
                updateFlash({error:""});
            },4000);
        }
        else{
            updateFlash({error:`${errorMsg.message}`});
            setTimeout(()=>{
                updateFlash({error:""});
            },4000);
        }
    
    }}

    return (
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
            <h3>Add New Event here</h3>
             <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField label="Title" 
                     {...register("title")}
                    color="secondary" 
                    name='title'
                    type='text'
                    focused/>
                    <br />  <br />
{errors.title && <p style={{color:"red"}}>{errors.title.message}</p>}
                    <TextField label="Description" 
                    {...register("description")}
                    color="secondary" 
                    name='description'
                     type='text'
                    focused/>
                    <br />  <br />
                  {errors.description && <p style={{color:"red"}}>{errors.description.message}</p>}
                  <TextField label="Location" 
                   {...register("location")}
                    color="secondary" 
                    name='location'
                    type='text'
                    focused
                    />
                    <br />  <br />
                    {errors.location && <p style={{color:"red"}}>{errors.location.message}</p>}
                    <TextField label="Price"
                     {...register("price")} 
                    color="secondary" 
                    name='price'
                    type='number'
                    focused
                    />
                           {errors.price && <p style={{color:"red"}}>{errors.price.message}</p>}
                    <br />  <br />
                       <TextField label="Available Tickets" 
                    {...register("availableTickets")}
                    color="secondary" 
                    name='availableTickets'
                    type='number'
                    focused
                    />
                    {errors.availableTickets && <p style={{color:"red"}}>{errors.availableTickets.message}</p>}
                    <br /><br />
                    <Controller
          name="category"
          control={control}
          render={({ field }) => (
<FormControl>
  <FormLabel id="category">Category</FormLabel>
  <RadioGroup
  {...field}
  >
    <FormControlLabel value="Music" control={<Radio />} label="Music" />
    <FormControlLabel value="Sports" control={<Radio />} label="Sports" />
    <FormControlLabel value="Others" control={<Radio />} label="Others" />
  </RadioGroup>
</FormControl>)}/>
{errors.category && <p style={{color:"red"}}>{errors.category.message}</p>}
<br /><br/>
<Controller
          name="status"
          control={control}
          render={({ field }) => (
<FormControl>
  <FormLabel id="status">Status</FormLabel>
  <RadioGroup
  {...field}
  >
    <FormControlLabel value="Scheduled" control={<Radio />} label="Scheduled" />
    <FormControlLabel value="Ongoing" control={<Radio />} label="Ongoing" />
    <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
  </RadioGroup>
</FormControl>)}/>
{errors.status && <p style={{color:"red"}}>{errors.status.message}</p>}
<br /><br/>

                    <TextField label="Start Date" 
                    {...register("startDate")}
                    color="secondary" 
                    name='startDate'
                    type='date'
                    focused 
                    /><br/><br/>
                    {errors.startDate && <p style={{color:"red"}}>{errors.startDate.message}</p>}
                    <TextField label="End Date" 
                    {...register("endDate")}
                    color="secondary" 
                    name='endDate'
                    type='date'
                    focused 
                    /><br/><br/>
                     {errors.endDate && <p style={{color:"red"}}>{errors.endDate.message}</p>}
                    <Button variant="contained" type='submit'>Submit</Button>
                    </form>
        </div>
    )
}