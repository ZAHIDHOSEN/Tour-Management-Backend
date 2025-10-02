/* eslint-disable @typescript-eslint/no-explicit-any */

import { ISSLCommerz } from "../../../sslCommerz/sslCommerz.interface";
import { SSLService } from "../../../sslCommerz/sslCommerz.services";
import AppError from "../../errHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import httpStatus from "http-status-codes";

// 

const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};



const successPayment = async(query:Record<string,string>) =>{

    // update booking status to config
    // update payment status PAID

       const session = await Booking.startSession()
    session.startTransaction()

    try {


     
     
     const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},{
     
      status: PAYMENT_STATUS.PAID,
       
     },{new: true, runValidators: true, session: session })

      await Booking.findByIdAndUpdate(
        updatedPayment?.booking,
      {status:BOOKING_STATUS.COMPLETE},
      {new: true, runValidators:true, session}
    )
    
    
    await session.commitTransaction();
    session.endSession()

    return {
     success:true,
     message:"payment completed successfully"
    }
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error) {
      await session.abortTransaction();
      session.endSession()
      throw error
    }
 

   



}


const failPayment = async(query:Record<string,string>) =>{

    // update booking status failed
    // update payment Status failed

    
    const session = await Booking.startSession()
    session.startTransaction()

    try {


     
     
     const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},{
     
      status: PAYMENT_STATUS.FAILED,
       
     },{ runValidators: true, session: session })

      await Booking.findByIdAndUpdate(
        updatedPayment?.booking,
      {status:BOOKING_STATUS.CANCEL},
      {runValidators:true, session}
    )
    
    
    await session.commitTransaction();
    session.endSession()

    return {
     success:false,
     message:"payment failed"
    }
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error) {
      await session.abortTransaction();
      session.endSession()
      throw error
    }


}



const cancelPayment = async(query:Record<string,string>)=>{
    // update booking status cancel
    // update payment status cancel

     const session = await Booking.startSession()
    session.startTransaction()

    try {


     
     
     const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},{
     
      status: PAYMENT_STATUS.CANCELED,
       
     },{runValidators: true, session: session })

      await Booking.findByIdAndUpdate(
        updatedPayment?.booking,
      {status:BOOKING_STATUS.CANCEL},
      { runValidators:true, session}
    )
    
    
    await session.commitTransaction();
    session.endSession()

    return {
     success:false,
     message:"payment canceled"
    }
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error) {
      await session.abortTransaction();
      session.endSession()
      throw error
    }
    
  

}


export const PaymentServices = {
 successPayment,
 failPayment,
 cancelPayment,
 initPayment
} 