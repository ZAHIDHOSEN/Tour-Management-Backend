/* eslint-disable @typescript-eslint/no-unused-vars */

import { catchAsync } from "../../utilis/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status-codes"
import { StatsServices } from "./stats.services";


const getUserStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{


   const userStats = await StatsServices.getUserStats()


     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user Stats",
        data: userStats,


     })

})


const getTourStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

  const tourStats = await StatsServices.getTourStats()

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "tourStats",
        data: tourStats,


     })

})


const getBookingStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     
   const bookingStats = await StatsServices.getBookingStats()


     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "booking stats Successfully",
        data: bookingStats,


     })

})
const getPaymentStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   
   const paymentStart = await StatsServices.getPaymentStats()

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "payment start get Successfully",
        data: paymentStart,


     })

})










export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats
}