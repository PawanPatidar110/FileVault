import { NextFunction, Request, Response } from "express";
import { success, ZodError } from "zod";

export const errorHandler = (
    error:unknown,
    _req:Request,
    res:Response,
    _next:NextFunction
) => {
    if(error instanceof ZodError){
    return res.status(400).json({
        success:false,
        message:"validation failed",
        errors:error.issues
    });
}

if(error instanceof Error){
    return res.status(400).json({
        success:false,
        message:error.message
    });
}

return res.status(500).json({
    success:false,
    message:"Internal server error"
});
};