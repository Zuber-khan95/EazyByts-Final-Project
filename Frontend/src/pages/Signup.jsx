import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { handleAxiosError } from '../utils/handleAxiosError';
import Alert from 'react-bootstrap/Alert';
axios.defaults.withCredentials=true;
import "./Signup.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../../formValidation.js';

export default function Signup()
{

let navigate = useNavigate();

let {user, login }=useAuth();
let{ flash, updateFlash }=useFlash();

const { register,reset,handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
        username: '',
        email: '',
        password: ''
    },
    mode:"onChange"
  });


let onSubmit =async (formData) => { 
    try{
        let res = await axios.post('http://localhost:5000/register', formData);
      
if(res.data.state==="success")
{
    login(res.data.user);
updateFlash({success:"Successfully registered and logged in also"});       
setTimeout(() =>{
    updateFlash({success:""})},4000);
    setTimeout(() => {
        navigate('/');
    }, 4000);
  reset();
}
    }

    catch(err)
    {
     const errorMsg=handleAxiosError(err);
   
     if(errorMsg.status==500){     
        updateFlash({error:"Server Error occurred"});
        setTimeout(() => {
            updateFlash({error:""})},4000); 
        }
        else if(errorMsg.status==409){
            updateFlash({error:"This Username already exists"});        
            setTimeout(() => {
              updateFlash({error:""});},4000);
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

     {flash.success &&  <Alert variant="success" onClose={() => updateFlash({success:""})} dismissible>
                      <Alert.Heading>Congratulation! You did it!</Alert.Heading>
                      <p>
                     {flash.success}
                      </p>
                    </Alert>}
         {flash.error &&  <Alert variant="danger" onClose={() => updateFlash({error:""})} dismissible>
         <Alert.Heading>Oh Snap! You got an error!</Alert.Heading>
         <p>{flash.error}</p>
         </Alert>}

        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit(onSubmit)} >
        <TextField label="Username" 
        {...register('username')}
        color="secondary" 
        name='username'
        focused />
         <p style={{color:'red'}}>{errors.username?.message}</p>
        <TextField label="Email" 
        {...register('email')}
        color="secondary" 
        name='email'
        focused />
        <p style={{color:'red'}}>{errors.email?.message}</p>
        <TextField label="Password" 
        {...register('password')}
        color="secondary" 
        name='password'
        type="password"
        focused />
        <p style={{color:'red'}}>{errors.password?.message}</p>
        
        <Button variant="contained" type='submit'>Submit</Button>
        </form>
        </div>
    );
}