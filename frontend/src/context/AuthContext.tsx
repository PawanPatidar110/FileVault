import {  createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/auth";
import { getMe, loginUser } from "../api/auth.api";

interface AuthContextType {
    user:User | null;
    loading:boolean;
    login:(
        email:string,
        password:string
    ) => Promise<void>;
    logout:() => void;
}

const AuthContext  = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {
    children:ReactNode;
}) => {
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if(!token){
            setLoading(false);
            return;
        }
        
        getMe().then((response) => {
            setUser(response.data);
        }).catch(() => {
            localStorage.removeItem("accessToken");
            setUser(null);
        }).finally(() => {
            setLoading(false);
        });

    },[]);

    const login = async (email:string,password:string)=> {
        const response = await loginUser({email,password});

        localStorage.setItem("accessToken",response.data.token);

        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }
    return context;
}