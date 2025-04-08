import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx"

const ProtectedRoute=({children})=>{
    const { user,loading } =useAuth();
    const navigate=useNavigate();
      useEffect(()=>{
        if(!loading && !user){
           navigate("/login"); 
        }}, [ user, navigate, loading]);

           if(!user){
            return null; 
        }
    if(loading){
        return loading&&<div className="loading-spinner">Loading...</div>
    }
 
    return children;
};

export default ProtectedRoute;