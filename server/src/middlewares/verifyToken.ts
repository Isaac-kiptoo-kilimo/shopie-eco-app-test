import { User } from "../types/interface";
import {Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";

export interface ExtendeUser extends Request{

    info?:User
}

export const verifyToken=(req:ExtendeUser, res:Response, next:NextFunction )=>{
    try{

        const token=req.headers['token'] as string

        if(!token){
            return res.status(404).json({
                message: "You do not have access"
            })
        }

        const data= jwt.verify(token,process.env.SECRET as string) as User

        req.info=data
        console.log(data);
        
    }catch(error){
        return res
    }

    next();
}