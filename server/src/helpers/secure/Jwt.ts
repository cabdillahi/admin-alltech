import { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'


interface userData {
  email: string
  role: string
  Userid: number
}


export const generateToken  = (user : userData)=>{
    const payload = user
    return jwt.sign(payload,process.env.secretKey || "secretKey@@",{
        expiresIn : "1d"
    })
}


//customuser Register

export interface CustomUserRequest extends Request {

    user? : userData

}
//BearerToken Bearer Token 
//decodetoken

export const decodeToken = async(req:CustomUserRequest,res:any,next:NextFunction)=>{

   try {
    
    const token = req.headers.authorization?.startsWith("Bearer") && req.headers.authorization?.split(' ')[1]

    if(!token){
        return res.status(405).json({
            message : "u don't have Token",
            isSuccess : false
        })
    }
  
    //decode

    const decode : {userId : Number; email : string ; Role : string} | any = jwt.verify(token, process.env.secretKey || "secretKey@@")
    req.user = {...decode}
    next()


   } catch (error) {
    res.json("u don't have Token ")
   }
   

} 