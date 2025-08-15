import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { divisionServices } from "./division.services";
import { sendResponse } from "../../utilis/sendResponse";
import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDivision = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{

    const division = await divisionServices.createDivision(req.body)
    console.log(division);

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "divisionCreated Successfully",
        data: division,


     })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateDivision = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const divisionId = req.params.id

     const payload = req.body
    const division = await divisionServices.updateDivision(divisionId,payload)

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "divisionUpdated Successfully",
        data: division,


     })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteDivision = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    const divisionId = req.params.id

   const verifiedToken = req.user
    const division = await divisionServices.deleteDivision(divisionId,verifiedToken as JwtPayload)

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "divisionDeleted Successfully",
        data: division,


     })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllDivision = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const result = await divisionServices.getAllDivision()
      sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All division get successfully",
        data: result.data,
        meta: result.meta


     })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleDivision = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
      const slug = req.params.slug
       const result = await divisionServices.getSingleDivision(slug)
      sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All division get successfully",
        data: result.data,
      


     })
})




export const divisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}