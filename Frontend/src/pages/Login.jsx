import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import {useAuth} from '../context/AuthContext';
import {useFlash} from "../context/FlashContext"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { handleAxiosError } from '../utils/handleAxiosError';
import Alert from 'react-bootstrap/Alert';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../formValidation.js';

export default function Login()
{
const {register,reset,handleSubmit, formState: { errors }}=useForm({
    resolver:yupResolver(loginSchema),
    defaultValues:{
        username:'',
        password:''
    },
})

const {login,user}=useAuth();
const {flash,updateFlash}=useFlash();
const navigate=useNavigate();

let onSubmit = async(formData) => {
     try{
        const response=await axios.post("http://localhost:5000/login",formData);
        if(response.data.state==="success"){
login(response.data.user);
         reset();
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
        const errorMsg=handleAxiosError(err);
       if(errorMsg.status==404){
        updateFlash({error:"This user does not exist maybe Username or password is incorrect. Try again"});
        setTimeout(()=>{
            updateFlash({error:""});
        },4000);
    }
    else if(errorMsg.status==500){
        updateFlash({error:"Server Error occurred"});
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
       }
     }   ;

    return (
        <div className="Form">
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
          
        <h3>Login page</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Username" 
        color="secondary" 
        name='username'
        type="text"
     {...register('username')}
        focused />
        {errors.username?.message && <p style={{color:'red'}}>{errors.username?.message}</p>}
        <br/><br/>
        <TextField label="Password" 
        color="secondary" 
        name='password'
        type='password'
        {...register('password')}   
        focused />
        {errors.password?.message && <p style={{color:'red'}}>{errors.password?.message}</p>}
        <br/><br/>
        <Button variant="contained" type='submit'>Submit</Button>
        </form>
        <p style={{color:"purple"}}><b>Don't have an account ? <u><a style={{color:"blue"}} onClick={()=>{navigate("/signup")}}>SignUp</a></u></b></p>
        </div>
    );
}