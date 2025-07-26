import { JWT_SECRET } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
interface Authrequest extends Request{
    userId:string
}
export function middleware(req:Authrequest,res:Response,next:NextFunction){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader || "";
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {userId : string};
        if (decoded) {
            req.userId = decoded.userId;  
            next();
        } else {
            res.status(403).json({
                message: "user unauthorized"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "user unauthorized"
        });
    }
}