import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import {useAuth} from '../context/AuthContext';
import {useFlash} from "../context/FlashContext"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function Login()
{
let [formData, setFormData] = useState({username: '', password: ''});

const {login,user}=useAuth();
const {flash,updateFlash}=useFlash();
const navigate=useNavigate();
let handleChange = (e) => { setFormData((CurrData)=>{
    return {...CurrData, [e.target.name]: e.target.value};
}
);}
let handleSubmit = async(e) => {
     e.preventDefault();
     try{
        const response=await axios.post("http://localhost:5000/login",formData);
        if(response.data.state==="success"){
login(response.data.user);
            setFormData({username: '', password: ''});
            updateFlash({success:"Successfully logged in"});
            setTimeout(()=>{
                updateFlash({success:""});
            },4000);
            setTimeout(()=>{
             navigate("/");
            },4000);
        }
     }
     catch(err)
     {
        updateFlash({error:"err.response.data.message"});
        setTimeout(()=>{
            updateFlash({error:""});
        },4000);
        console.error("Error:",err.response?err.response.data.message:"server error");
     }   
};
    return (
        <div className="Form">
            {flash?<p style={{color:"green"}}>{flash.success}</p>:<p style={{color:"red"}}>{flash.error}</p>}
        <h3>Login page</h3>
        <form onSubmit={handleSubmit}>
        <TextField label="Username" 
        color="secondary" 
        name='username'
        type="text"
        value={formData.username}
        onChange={handleChange}
        focused /><br/><br/>
        <TextField label="Password" 
        color="secondary" 
        name='password'
        type='password'
        value={formData.password}
        onChange={handleChange}
        focused /><br/><br/>
        <Button variant="contained" type='submit'>Submit</Button>
        </form>
        </div>
    )
}