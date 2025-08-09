/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilis/catchAsync"
import  httpStatus  from 'http-status-codes';

import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utilis/sendResponse";
import AppError from "../../errHelpers/appError";
import { setAuthCookie } from "../../utilis/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utilis/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    
   //   const loginInfo = await AuthServices.credentialsLogin(req.body)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   passport.authenticate("local",async(err: any, user:any, info:any)=>{
      if(err){
         // return next(err)
         return next(new AppError(401,err))
      }
      if(!user){
         return next(new AppError(401,info.message))
      }

       const userToken = await createUserTokens(user)
       
      const {password: pass, ...rest} = user.toObject()

      
      setAuthCookie(res,userToken)
        sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user Login Successfully",
        data: {
           accessToken : userToken.accessToken,
           refreshToken : userToken.refreshToken,
           user: rest
        }


     })

   })(req,res,next)
        
   //   res.cookie("accessToken",loginInfo.accessToken,{
   //      httpOnly:true,
   //      secure:false
   //   })
    
     
     
   //   res.cookie("refreshToken",loginInfo.refreshToken,{
   //      httpOnly:true,
   //      secure:false
   //   })

   
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, 'refresh token is not available')
    }
     const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

   //     res.cookie("accessToken",tokenInfo.accessToken,{
   //      httpOnly:true,
   //      secure:false
   //   })

      setAuthCookie(res,tokenInfo)

        sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user with new access Successfully",
        data: tokenInfo,


     })
})
const logout = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    
   res.clearCookie('accessToken',{
      httpOnly:true,
      secure:false,
      sameSite:"lax"

   })
   res.clearCookie('refreshToken',{
      httpOnly:true,
      secure:false,
      sameSite:"lax"

   })

        sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user logout Successfully",
        data: null


     })
})
const resetPassword = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    
  
  
   const newPassword = req.body.newSetPassword
   
   const oldPassword = req.body.oldPassword
   
    const decodedToken = req.user
   const newSetPassword = await AuthServices.resetPassword(oldPassword,newPassword,decodedToken as JwtPayload) 
  
       sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "password changed successfully",
        data: null


     })
})
const googleCallback = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    let redirectTo = req.query.state ? req.query.state as string : ""
    if(redirectTo.startsWith("/")){
     redirectTo= redirectTo.slice(1)
    }
   const user = req.user;
   console.log("user",user);
   if(!user){
      throw new AppError(httpStatus.NOT_FOUND,"user not found")
   }
   const tokenInfo = createUserTokens(user)
  
  setAuthCookie(res,tokenInfo)
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
   //     sendResponse(res,{
   //      success: true,
   //      statusCode: httpStatus.CREATED,
   //      message: "google login successfully",
   //      data: null


   //   })
})
    

export const AuthControlar = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback
}