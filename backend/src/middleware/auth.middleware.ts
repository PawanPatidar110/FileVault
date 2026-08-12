import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId:string;
            }
        }
    }
}

export const authenticate = (req:Request,res:Response,next:NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            return res.status(401).json({
                success:false,
                message:"Authorization token is required"
            });
        }

        const [scheme , token] = authorization.split(" ");

        if(scheme !== "Bearer" || !token){
            return res.status(401).json({
                success:false,
                message:"Invalid authorization format"
            });
        }

        const payload = verifyAccessToken(token);

        req.user = {
            userId:payload.userId
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        });
    }
};