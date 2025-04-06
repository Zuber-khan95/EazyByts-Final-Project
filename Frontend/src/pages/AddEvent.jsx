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
import './AddEvent.css'
export default function AddEvent()
{
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        location:"",
        price:"",
        category:"",
        status:"",
        startDate:"",
        endDate:"",

    });

    const {flash,updateFlash}=useFlash();

    const navigate=useNavigate();

    let handleChange=(event)=>{
        setFormData((currData)=>{
return {...currData,[event.target.name]:event.target.value};
        });
    }

    let handleSubmit=async(event)=>{
        event.preventDefault();
        try{
        const response=await axios.post("http://localhost:5000/event/new",formData);
        if(response.data.state==="success")
        {
            updateFlash({success:"Successfully Added the Event"});
            setTimeout(()=>{
                updateFlash({success:""});
            },4000);
            setFormData({
                title:"",
                description:"",
                location:"",
                price:"",
                category:"",
                status:"",
                startDate:"",
                endDate:"",
            });
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
            updateFlash({error:`${errorMsg}`});
            setTimeout(()=>{
                updateFlash({error:""});
            },4000);
        }
    
    }}

    return (
        <div id="Form">
            {flash.success&&<p style={{color:"green"}}>{flash.success}</p>}
           {flash.error&& <p style={{color:"red"}}>{flash.error}</p>}
            <h3>Add New Event here</h3>
             <form onSubmit={handleSubmit}>
                    <TextField label="Title" 
                    color="secondary" 
                    name='title'
                    type='text'
                    value={formData.title}
                    onChange={handleChange}
                    required
                    focused /><br/><br/>

                    <TextField label="Description" 
                    color="secondary" 
                    name='description'
                     type='text'
                    value={formData.description}
                    onChange={handleChange}
                    focused
                    required
                     /><br/><br/>

                  <TextField label="Location" 
                    color="secondary" 
                    name='location'
                    type='text'
                    value={formData.location}
                    onChange={handleChange}
                    focused
                    required
                    /><br/><br/>
                    <TextField label="Price" 
                    color="secondary" 
                    name='price'
                    type='text'
                    value={formData.price}
                    onChange={handleChange}
                    focused
                    required
                    /><br/><br/>

<FormControl>
      <FormLabel className='radioLabel' id="category">Category</FormLabel>
      <RadioGroup
        aria-labelledby="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        >
        <FormControlLabel value="Music" control={<Radio />} label="Music" />
        <FormControlLabel value="Sports" control={<Radio />} label="Sports" />
        <FormControlLabel value="Others" control={<Radio />} label="Others" />
      </RadioGroup>
      <FormLabel  className='radioLabel' id="status">Status</FormLabel>
      <RadioGroup
        aria-labelledby="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required>
        <FormControlLabel value="Scheduled" control={<Radio />} label="Scheduled" />
        <FormControlLabel value="Ongoing" control={<Radio />} label="Ongoing" />
        <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
      </RadioGroup>
     
    </FormControl>

                    <br /><br />
                    <TextField label="Start Date" 
                    color="secondary" 
                    name='startDate'
                    type='date'
                    value={formData.startDate}
                    onChange={handleChange}
                    focused 
                    required/><br/><br/>

                    <TextField label="End Date" 
                    color="secondary" 
                    name='endDate'
                    type='date'
                    value={formData.endDate}
                    onChange={handleChange}
                    focused 
                    required/><br/><br/>
                    <Button variant="contained" type='submit'>Submit</Button>
                    </form>
        </div>
    )
}