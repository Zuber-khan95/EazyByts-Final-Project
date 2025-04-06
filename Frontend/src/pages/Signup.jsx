import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { handleAxiosError } from '../utils/handleAxiosError';
import "./Signup.css";

export default function Signup()
{
let [formData, setFormData] = useState({username:'',email: '', password: ''});
let navigate = useNavigate();

let {user, login }=useAuth();
let{ flash, updateFlash }=useFlash();

let handleChange = (e) => { setFormData((CurrData)=>{
    return {...CurrData, [e.target.name]: e.target.value};
});
};

let handleSubmit =async (e) => { 
    e.preventDefault();
    try{
        let res = await axios.post('http://localhost:5000/register', formData);
if(res.data.state==="success")
{
    login(res.data.user);
    updateFlash({success:"Successfully Registered and logged in "});
    setTimeout(() => {
        updateFlash({success:""},4000);});
    setTimeout(() => {
        navigate('/');
    }, 4000);
    setFormData({username:'',email: '', password: ''});
}
    }

    catch(err)
    {
     const errorMsg=handleAxiosError(err);
     if(errorMsg==="Server Error occured"){     
        updateFlash({error:"Username already exist"});
        setTimeout(() => {
            updateFlash({error:""})},4000); 
        }
        else{
            updateFlash({error:`${errorMsg}`});
            setTimeout(() => {
                updateFlash({error:""},4000);}); 
        }
    }
};
     
    return (

        <div className='Form'>
            {flash.success&&<p style={{color:"green"}}>{flash.success}</p>}
            {flash.error&&<p style={{color:"red"}}>{flash.error}</p>}
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit} >
        <TextField label="Username" 
        color="secondary" 
        name='username'
        value={formData.username}
        onChange={handleChange}
        focused /><br/><br/>
        <TextField label="Email" 
        color="secondary" 
        name='email'
        value={formData.email}
        onChange={handleChange}
        focused /><br/><br/>
        <TextField label="Password" 
        color="secondary" 
        name='password'
        type="password"
        value={formData.password}
        onChange={handleChange}
        focused /><br/><br/>
        <Button variant="contained" type='submit'>Submit</Button>
        </form>
        </div>
    );
}