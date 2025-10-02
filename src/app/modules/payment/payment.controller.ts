import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilis/catchAsync"
import { PaymentServices } from "./payment.services"
import { envVars } from "../../config/env"
import { sendResponse } from "../../utilis/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentServices.initPayment(bookingId as string)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const successPayment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const query = req.query
  const result = await PaymentServices.successPayment(query as Record<string,string>)

   if(result?.success){
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    
   }
    
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const failPayment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const query = req.query
  const result = await PaymentServices.failPayment(query as Record<string,string>)

   if(!result?.success){
    res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}
        &message=${result.message}&amount=${query.amount}&status=${query.status}`)
    
   }
})




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelPayment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const query = req.query
  const result = await PaymentServices.cancelPayment(query as Record<string,string>)

   if(!result.success){
    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}
    &message=${result.message}&amount=${query.amount}&status=${query.status}`)
    
   }
})


export const PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
}