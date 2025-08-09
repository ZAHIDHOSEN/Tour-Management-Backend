/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errHelpers/appError";
import { handleDuplicateError } from "../helperFunction/handleDuplicateError";
import { handleCastError } from "../helperFunction/handleCastError";
import { handleZodError } from "../helperFunction/handleZodError";
import { handleValidationError } from "../helperFunction/handleValidationError";
import { TErrorSource } from "../interfaces/error.type";





// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const  globalErrHandler =  (err: any, req: Request, res: Response ,next: NextFunction)=>{
   if(envVars.NODE_ENV === "development"){
     console.log(err);
   }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorsSoursc :TErrorSource[] = [
    //   {
    //   path : "isDeleted",
    //   message: "Cast Failed"

    // }
  ];

   let statusCode = 500;
   let message =  `something went wrong`;
   
  //  mongoose error
  // 1.duplicate error
  // 2.castError 
  // 3.Validation Error

  


  //  duplicate error 
    if(err.code === 11000){
     const simplifiedError = handleDuplicateError(err)
      statusCode = simplifiedError.statusCode,
      message = simplifiedError.message
      
   }
  //  castError  or objectId error 
   else if(err.name === "CastError"){
     const simplifiedError = handleCastError(err)
      statusCode = simplifiedError.statusCode,
      message = simplifiedError.message

   }
  //  zod error
   else if(err.name === "ZodError"){
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode,
    message = simplifiedError.message,
    errorsSoursc = simplifiedError.errorsSoursc as TErrorSource[]
    
   }
  //  Mongoose validation error
   else if(err.name === "ValidationError"){
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    errorsSoursc = simplifiedError.errorsSoursc as TErrorSource[]
    message = simplifiedError.message
   
   }

    else if(err instanceof AppError){
    statusCode = err.statusCode
    message = err.message
   }else if(err instanceof Error){
    statusCode = 500;
    message = err.message
   }

   
  res.status(statusCode).json({
    success: false,
    message,
    errorsSoursc,
    err : envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
    

  })

}

