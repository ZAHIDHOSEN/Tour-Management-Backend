
import { ISSLCommerz } from "../../../sslCommerz/sslCommerz.interface";
import { SSLService } from "../../../sslCommerz/sslCommerz.services";
import AppError from "../../errHelpers/appError"
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.models";
import { User } from "../user/user.models"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import { Booking } from "./booking.model"
import  httpStatus  from 'http-status-codes';



const getTransactionId = () =>{

    return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBooking = async(payload: Partial<IBooking>,userId: string) =>{
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()

    try {

     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.findById(userId)
    

    //  if(!user?.phoneNumber || !user?.address){
    //     throw new AppError(httpStatus.BAD_GATEWAY, "please update your profile to Book tour")
    //  }

     const tour = await Tour.findById(payload.tour).select("costForm")
      if(!tour?.costForm){
        throw new AppError(httpStatus.BAD_REQUEST, "No tour cost")

      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const amount = Number(tour.costForm) * Number(payload.guestCount!)

     const booking = await Booking.create([{
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
     }],{session})
     
     
     const payment = await Payment.create([{
        booking : booking[0]._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount : amount,
     }],{session})

     const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id,
      {payment:payment[0]._id},
      {new: true, runValidators:true, session}
    ).populate("user","name email phoneNumber address").populate("tour","title costForm").populate("payment")
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAddress = (updatedBooking?.user as any).address
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmail = (updatedBooking?.user as any).email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPhoneNUmber = (updatedBooking?.user as any).phoneNumber
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userName = (updatedBooking?.user as any).name


    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email:userEmail,
      phoneNumber:userPhoneNUmber,
      name:userName,
      amount:amount,
      transactionId:transactionId
    }
    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    console.log(sslPayment)
    




    await session.commitTransaction();
    session.endSession()

    return {
      paymentUrl:sslPayment.GatewayPageURL,
      booking:updatedBooking,
    }
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error) {
      await session.abortTransaction();
      session.endSession()
      throw error
    }
   


}

// front -user - tour - book - payment - sslCommerrz - payment

// -backend -payment(update) - booking conform - redirect front-end





const getAllBooking = async() =>{
    const booking = await Booking.find({})
       const totalBooking = await Booking.countDocuments()
       return{
         data: booking,
         meta:{
           total: totalBooking
         }
       }
}

const getSingleBooking = async(id: string) =>{
    const booking = await Booking.findById(id)
       return{
         data: booking,
       
       }
}

// const updateDivision = async(divisionId:string, payload:Partial<IDivision>) =>{
//    const isDivisionExits = await Division.findById(divisionId)
//    if(!isDivisionExits){
//     throw new AppError(httpStatus.NOT_FOUND, "division not found")
//    }

//      const duplicateDivision = await Division.findOne({
//       name: payload.name,
//       _id: {$ne: divisionId}
//      })

//      if(duplicateDivision){
//       throw new Error ("A Division with this name is already exits")
//      }

//     // if(payload.name){
//     //         const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-")
//     //         let slug = `${baseSlug}-division`


//     //         let counter = 0;
//     //        while(await Division.exists({slug})){
//     //        slug = `${slug}-${counter++}`
//     //       }
//     //       payload.slug = slug;
//     // } 


//   const updatedDivision = await Division.findByIdAndUpdate(divisionId, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return updatedDivision



  
   
// }
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const deleteDivision = async(divisionId:string,decodedToken:JwtPayload) =>{
//    const isDivisionExits = await Division.findById(divisionId)
//    if(!isDivisionExits){
//     throw new AppError(httpStatus.NOT_FOUND, "division not found")
//    }

//     if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
//     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete this division");
//   }

//     const toursCount = await Tour.countDocuments({ division: divisionId });
//   if (toursCount > 0) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Cannot delete division because it has associated tours"
//     );
//   }
   
//    const deleteDivision = await Division.findByIdAndDelete(divisionId)

//    return deleteDivision
 




  
   
// }


export const bookingServices = {
    createBooking,
    getAllBooking,
    getSingleBooking
}