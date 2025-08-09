/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes"

import { userServices } from "./user.service";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from './../../utilis/sendResponse';
import { verifyToken } from "../../utilis/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";





// const createUser = async(req:Request, res:Response, next: NextFunction)=>{
//     try{
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake")
        
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      
     
//     }catch(err: any){
//         console.log(err);
//         next(err)
//     }
// }
const createUser = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const user = await userServices.createUser(req.body)
    
    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     user
    // })

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "userCreated Successfully",
        data: user,


     })
})
const updateUser = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const userId = req.params.id
   //   const token = req.headers.authorization
   //   const verifyingToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
   const verifiedToken = req.user
     const payload = req.body
    const user = await userServices.updateUser(userId,payload,verifiedToken as JwtPayload)

    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     user
    // })

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "userUpdated Successfully",
        data: user,


     })
})

const getAllUser = catchAsync(async (req:Request, res:Response, next: NextFunction)=>{
      const result = await userServices.getAllUser()
       sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All user retrive succesfully",
        data: result.data,
        meta: result.meta


     })
})

export const UserControllers = {
    createUser,
    getAllUser,
    updateUser
}