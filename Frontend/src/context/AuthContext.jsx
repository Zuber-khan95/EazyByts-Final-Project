import React , { createContext,useState,useContext, useEffect} from 'react'

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [ user, setUser]=useState(null);
    const [ loading , setLoading ]=useState(true);
    useEffect(()=>{
        const storedUser=localStorage.getItem('user');
        if(storedUser && storedUser!=="undefined"){
            const parsedUser=JSON.parse(storedUser);
            setUser(parsedUser);
        }
        setLoading(false);
    },[]);
    
    const login=(userData)=>{
        setUser(userData);
        localStorage.setItem('user',JSON.stringify(userData));
        setLoading(false);
    };
    
    const updateUser=(userData)=>{
        setUser(userData);
        localStorage.setItem('user',JSON.stringify(userData));
    };

    const logout=()=>{
        setUser(null);
        localStorage.removeItem('user');
        setLoading(true);
    }
    return (
        <AuthContext.Provider value={{ user ,updateUser, login , logout ,loading}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth=()=>{
    return useContext(AuthContext);
}