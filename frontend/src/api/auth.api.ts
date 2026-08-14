import type { AuthResponse } from "../types/auth";
import api from "./axios";

interface LoginPayload {
    email:string;
    password:string;
}


interface RegisterPayload {
    name:string;
    email:string;
    password:string;
}

export const registerUser = async (payload:RegisterPayload) => {
    const response = await api.post("/auth/register",payload);

    return response.data;
};


export const loginUser = async (payload:LoginPayload):Promise<AuthResponse> => {
    const response = await api.post("/auth/login",payload);

    return response.data;
}

export const getMe = async () => {
    const response = await api.get("/auth/me");

    return response.data;
}