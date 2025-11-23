import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";
import  httpStatus  from 'http-status-codes';
import { OTPServices } from "./otp.services";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendOTP = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
    const {email,name} = req.body
    await OTPServices.sendOTP(email,name)

       sendResponse(res,{
        success: true,
        statusCode:httpStatus.OK,
        message: "send otp successfully",
        data: null


     })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyOTP = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const {email,otp}= req.body
   await OTPServices.verifyOTP(email,otp)
        sendResponse(res,{
        success: true,
        statusCode:httpStatus.OK,
        message: "otp verify successfully",
        data: null


     })

})






export const OTPController = {
    sendOTP,
    verifyOTP
}