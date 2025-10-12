import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { tourServices } from "./tour.services";
import { sendResponse } from "../../utilis/sendResponse";
import  httpStatus  from 'http-status-codes';
import { ITour } from "./tour.interface";





// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTour = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
     const payload:ITour={
        ...req.body,
        images:(req.files as Express.Multer.File[]).map(file=>{
            return file.path
        })
     }
    const tour = await tourServices.createTour(payload)

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "tourCreated Successfully",
        data: tour,


     })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
 const getAllTour = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const query = req.query
    const result = await tourServices.getAllTour(query as Record<string,string> )
       sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All tourType get successfully",
        data: result.data,
        meta: result.meta


     })

 })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateTour = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const id = req.params.id
       const payload:ITour={
        ...req.body,
        images:(req.files as Express.Multer.File[]).map(file=>{
            return file.path
        })
     }

    const updatedTour = await tourServices.updateTour(id,payload)

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: updatedTour,
    });
   
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteTour =  catchAsync(async(req:Request, res:Response,next: NextFunction)=>{
    const {id} = req.params
    const result = await tourServices.deleteTour(id)

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour  Deleted successfully',
        data: result,
    });
})


// tourType controller

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTourType = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
    const {name} = req.body;
    const result = await tourServices.createTourType({name});
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllTourType = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const result = await tourServices.getAllTourType()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All tourType get successfully",
        data: result.data,
        meta: result.meta


     })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatedTourType = catchAsync(async(req:Request, res:Response,next: NextFunction)=>{
    const {id} = req.params
    const {name} = req.body
    const result = await tourServices.updateTourType(id,{name})
    

       sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteTourType =  catchAsync(async(req:Request, res:Response,next: NextFunction)=>{
    const {id} = req.params
    const result = await tourServices.deleteTourType(id)

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type Deleted successfully',
        data: result,
    });
})

export const tourController = {
       createTour,
       getAllTour,
       updateTour,
       deleteTour,
       createTourType,
       getAllTourType,
       updatedTourType,
       deleteTourType
}