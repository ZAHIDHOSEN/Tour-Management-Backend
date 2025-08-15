import mongoose from "mongoose"
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error.type"



export const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse =>{
  const errorsSoursc : TErrorSource [] = []

   
    const errors = Object.values(err.errors)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((errorObject:any) => errorsSoursc.push({
      path: errorObject.path,
      message: errorObject.message
    }))
    
     return{
      statusCode: 400,
      message: "validation Error",
      errorsSoursc
      
     }
   }