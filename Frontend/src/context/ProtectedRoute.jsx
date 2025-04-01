import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx"

const ProtectedRoute=({children})=>{
 
    const navigate=useNavigate();
const { user } =useAuth();
if(!user){
    navigate("/login");
}

    return(
        children
    )
};

export default ProtectedRoute;