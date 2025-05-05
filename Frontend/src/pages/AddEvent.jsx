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
            price:{
                diamond:"",   
                gold:"",
                silver:"",},
            availableTickets:{
              diamond:"",   
              gold:"",
              silver:"",
            },
            category:"Others",
            status:"Scheduled",
            startDate:"",
            endDate:"",
            image:""
            
    },});

    const {flash,updateFlash}=useFlash();

    const navigate=useNavigate();
    let onSubmit=async(formData)=>{
          const fd = new FormData();

          // Append all the values from the form
          fd.append("title", formData.title);
          fd.append("description", formData.description);
          fd.append("location", formData.location);
          fd.append("price", JSON.stringify(formData.price));
          fd.append("availableTickets", JSON.stringify(formData.availableTickets));
          fd.append("category", formData.category);
          fd.append("status", formData.status);
          fd.append("startDate", formData.startDate);
          fd.append("endDate", formData.endDate);
          
          if (formData.image && formData.image[0]) {
            fd.append("image", formData.image[0]);
          } 
          try{

          const response = await axios.post("http://localhost:5000/event/new",fd, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
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
    
    }
  }
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
             <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <TextField label="Title" 
                     {...register("title")}
                    color="secondary" 
                    name='title'
                    type='text'
                    focused fullWidth
                    error={!!errors?.title}
                    helperText={errors?.title?.message}
                    margin="normal"/>
                    <br />  <br />
                    <TextField label="Description" 
                    {...register("description")}
                    color="secondary" 
                    name='description'
                     type='text'
                    focused
                    fullWidth
                    error={!!errors?.description}
                    helperText={errors?.description?.message}/>
                    <br />  <br />
                  <TextField label="Location" 
                   {...register("location")}
                    color="secondary" 
                    name='location'
                    type='text'
                    focused
                    fullWidth
                    error={!!errors?.location}
                    helperText={errors?.location?.message}
                 />
                    <br />  <br />
             <TextField label="Available Diamond Tickets" 
                    {...register("availableTickets.diamond")}
                    color="secondary" 
                    name='availableTickets.diamond'
                    type='number'
                    focused
                    error={!!errors?.availableTickets?.diamond}
                    helperText={errors?.availableTickets?.diamond?.message}
                    />
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <TextField label="Diamond Ticket Price"
                     {...register("price.diamond")} 
                    color="secondary" 
                    name='price.diamond'
                    type='number'
                    focused
                    error={!!errors?.price?.diamond}
                    helperText={errors?.price?.diamond?.message}
                    />
                    <br />  <br />
                    <TextField label="Available Gold Tickets" 
                    {...register("availableTickets.gold")}
                    color="secondary" 
                    name='availableTickets.gold'
                    type='number'
                    focused
                    error={!!errors?.availableTickets?.gold}
                    helperText={errors?.availableTickets?.gold?.message}
                    />
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <TextField label="Gold Ticket Price"
                     {...register("price.gold")} 
                    color="secondary" 
                    name='price.gold'
                    type='number'
                    focused
                    error={!!errors?.price?.gold}
                    helperText={errors?.price?.gold?.message}
                    />
                    <br />  <br />
                    <TextField label="Available Silver Tickets" 
                    {...register("availableTickets.silver")}
                    color="secondary" 
                    name='availableTickets.silver'
                    type='number'
                    focused
                    error={!!errors?.availableTickets?.silver}
                    helperText={errors?.availableTickets?.silver?.message}
                    /> 
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <TextField label="Silver Ticket Price"
                     {...register("price.silver")} 
                    color="secondary" 
                    name='price.silver'
                    type='number'
                    focused
                    error={!!errors?.price?.silver}
                    helperText={errors?.price?.silver?.message}
                    />
                    <br />  <br />
                    <TextField label="Event Image"
                    {...register("image")} 
                    color="secondary"
                    name="image"
                    type="file"
                    inputProps={{ accept: "image/*" }} 
                    focused
                    fullWidth
                    error={!!errors?.image}
                    helperText={errors?.image?.message}
                    />
                    <br /><br/>
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
&nbsp; &nbsp; &nbsp; &nbsp;
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
                    fullWidth
                    error={!!errors?.startDate}
                    helperText={errors?.startDate?.message}
                    /><br/><br/>
                    {errors.startDate && <p style={{color:"red"}}>{errors.startDate.message}</p>}
                    <TextField label="End Date" 
                    {...register("endDate")}
                    color="secondary" 
                    name='endDate'
                    type='date'
                    focused 
                    fullWidth
                    error={!!errors?.endDate}
                    helperText={errors?.endDate?.message}
                    /><br/><br/>
                    <Button variant="contained" type='submit'>Submit</Button>
                    </form>
        </div>
    )
}