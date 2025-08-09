/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error.type"

 
 
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 export const handleZodError = (err:any):TGenericErrorResponse =>{
      const errorsSoursc : TErrorSource [] = []
    err.issues.forEach((issue: any) =>{
      errorsSoursc.push({
        path: issue.path(issue.path.length -1),
        message: issue.message
      })
    })
    return{
      statusCode: 400,
      message: "Zod Error",
      errorsSoursc
    }
  }