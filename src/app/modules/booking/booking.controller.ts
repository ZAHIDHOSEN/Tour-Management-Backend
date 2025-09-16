import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";
import { bookingServices } from "./booking.services";
import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBooking = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
    const payload = req.body
    const decodedToken = req.user as JwtPayload
    const booking = await bookingServices.createBooking(payload, decodedToken.userId)
    

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "bookingCreated Successfully",
        data: booking,


     })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const updateDivision = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
//     const divisionId = req.params.id

//      const payload = req.body
//     const division = await divisionServices.updateDivision(divisionId,payload)

//      sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "divisionUpdated Successfully",
//         data: division,


//      })
// })


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const deleteDivision = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
//     const divisionId = req.params.id

//    const verifiedToken = req.user
//     const division = await divisionServices.deleteDivision(divisionId,verifiedToken as JwtPayload)

//      sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "divisionDeleted Successfully",
//         data: division,


//      })
// })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllBooing = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const result = await bookingServices.getAllBooking()
      sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All booking get successfully",
        data: result.data,
        meta: result.meta


     })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleBooking = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
      const id = req.params.id
       const result = await bookingServices.getSingleBooking(id)
      sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: " single booking get successfully",
        data: result.data,
      


     })
})


export const bookingController = {
    createBooking,
    getAllBooing,
    getSingleBooking
}
