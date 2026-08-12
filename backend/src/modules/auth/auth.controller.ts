
import { Request, Response } from "express";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js"

export const register = async (req:Request , res:Response) => {
    const validateData = registerSchema.parse(req.body);
    const user = await registerUser(validateData.name,validateData.email,validateData.password);

    return res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:user
    });
};

export const login = async (req:Request,res:Response) => {
    const validateData = loginSchema.parse(req.body);
    const result = await loginUser(validateData.email,validateData.password);

    return res.status(200).json({
        success:true,
        message:"Logged in Successfully",
        data:result
    });
};

export const me = async (
    req: Request,
    res:Response
) => {
    const user = await getCurrentUser(req.user!.userId);
   
    return res.status(200).json({
        success:true,
        data:user
    });
};

