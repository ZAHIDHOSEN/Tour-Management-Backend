import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.type"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse =>{

  return {
   statusCode: 400,
    message: "Invalid MongoDB objectId. please provide valid object id"
  }
}