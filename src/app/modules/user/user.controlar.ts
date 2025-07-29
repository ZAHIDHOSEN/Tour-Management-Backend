/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes"

import { userServices } from "./user.service";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from './../../utilis/sendResponse';





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
    getAllUser
}