import { NextFunction, Request, Response } from "express";
import AppError from "../errHelpers/appError";
import { verifyToken } from "../utilis/jwt";
import { envVars } from "../config/env";
import  { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.models";
import  httpStatus  from 'http-status-codes';
import { isActive } from "../modules/user/user.interface";


export const checkAuth = (...authRoles: string[]) => async(req:Request, res:Response, next: NextFunction)=>{
   try{
       const accessToken = req.headers.authorization;
       if(!accessToken){
        throw new AppError(403, "no token Recieved")
       }

       const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
       
        const isUserExit = await User.findOne({email:verifiedToken.email})
         if(!isUserExit){
          throw new AppError(httpStatus.BAD_REQUEST,"User does not exit")

         }
         if(isUserExit.isActive === isActive.BLOCKED || isUserExit.isActive === isActive.INACTIVE){
          throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")

         }
         if(isUserExit.isDeleted === true){
          throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted")

         }
   
       if(!authRoles.includes(verifiedToken.role)){
           throw new AppError(403, "You are not permitted to view data")
       }

        req.user =  verifiedToken
       next()
   }catch(error){
     next(error)
   }
}