import express from "express"
import { Router } from "express"
import { Signupschema,Signinschema} from "./types";
import {prismaclient} from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config";

export const userroutes:Router=express.Router();
userroutes.post("/signup",async(req,res)=>{
    const parseddata=Signupschema.safeParse(req.body);

    if(!parseddata || !parseddata.success){
        res.json({
            message:"Invalid input"
        })
        return
    }
    const user = await prismaclient.users.findFirst({
        where:{
        email:parseddata.data.email
        }
    })
    if(user){
        res.json({
            message:"email already exists"
        })
        return
    }
    const hashedpassword=await bcrypt.hash(parseddata.data?.password,10)
    try{
        await prismaclient.users.create({
        data:{
            email:parseddata.data.email,
            username:parseddata.data.username,
            password:hashedpassword
        }
    })
    }
    catch(e){
        console.log(e)
        res.json({
            message:"sorry database is down.Try again later"
        })
    }
    res.json({
        message:"you are signed up"
    })
})
userroutes.post("/signin",async(req,res)=>{
    const parseddata= Signinschema.safeParse(req.body)
    if(!parseddata || !parseddata.success){
        res.json({
            message:"invalid input"
        })
        return
    }
    const useremail = await prismaclient.users.findFirst({
        where:{
            email:parseddata.data.email
        }
    })
    if(!useremail){
        res.json({
            message:"Email not found"
        })
        return
    }
    const passsword = await bcrypt.compare(parseddata.data.password,useremail.password)
    if(!passsword){
        res.json({
            message:"incorrect password"
        })
        return
    }
    const token = jwt.sign({
        userId:useremail.id
    },JWT_SECRET)
    res.json({
        token:token
    })
})
userroutes.get("/profile",middleware,async(req:any,res)=>{
    try {
        const user = await prismaclient.users.findFirst({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                email: true,
                username: true,
                // Don't return password
            }
        });
        
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        
        res.json({
            message: "Profile fetched successfully",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})
