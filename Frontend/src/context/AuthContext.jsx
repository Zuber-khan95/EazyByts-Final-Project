import React , { createContext,useState,useContext, useEffect} from 'react'

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [ user, setUser]=useState(null);
    const [ loading , setLoading ]=useState(true);
    useEffect(()=>{
        const storedUser=localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[]);
    
    const login=(userData)=>{
        setUser(userData);
        localStorage.setItem('user',JSON.stringify(userData));
        setLoading(false);
    };

    const logout=()=>{
        setUser(null);
        localStorage.removeItem('user');
        setLoading(true);
    }
    return (
        <AuthContext.Provider value={{ user , login , logout ,loading}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth=()=>{
    return useContext(AuthContext);
}