import { JwtPayload } from "jsonwebtoken";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import AppError from "../../errHelpers/appError";
import  httpStatus  from 'http-status-codes';

import { Role } from "../user/user.interface";
import { Tour } from "../tour/tour.models";
import { deleteFromCloudinary } from "../../config/cloudinary.config";


const createDivision = async(payload: Partial<IDivision>) =>{
    
   const existingDivision = await Division.findOne({name: payload.name})
   if(existingDivision){
    throw new Error("A division with this name is already exits")

   }
  //  const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-")
  //  let slug = `${baseSlug}-division`


  //  let counter = 0;
  //  while(await Division.exists({slug})){
  //   slug = `${slug}-${counter++}`
  //  }

  //  payload.slug = slug;

  const division = await Division.create(payload)

    return division


}

const getAllDivision = async() =>{
    const division = await Division.find({})
       const totalDivision = await Division.countDocuments()
       return{
         data: division,
         meta:{
           total: totalDivision
         }
       }
}

const getSingleDivision = async(slug: string) =>{
    const division = await Division.findOne({slug})
       return{
         data: division,
       
       }
}

const updateDivision = async(divisionId:string, payload:Partial<IDivision>) =>{
   const isDivisionExits = await Division.findById(divisionId)
   if(!isDivisionExits){
    throw new AppError(httpStatus.NOT_FOUND, "division not found")
   }

     const duplicateDivision = await Division.findOne({
      name: payload.name,
      _id: {$ne: divisionId}
     })

     if(duplicateDivision){
      throw new Error ("A Division with this name is already exits")
     }

    // if(payload.name){
    //         const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-")
    //         let slug = `${baseSlug}-division`


    //         let counter = 0;
    //        while(await Division.exists({slug})){
    //        slug = `${slug}-${counter++}`
    //       }
    //       payload.slug = slug;
    // } 


  const updatedDivision = await Division.findByIdAndUpdate(divisionId, payload, {
    new: true,
    runValidators: true,
  });
    if(payload.thumbnail && isDivisionExits.thumbnail){
      await deleteFromCloudinary(isDivisionExits.thumbnail)
    }

  return updatedDivision



  
   
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteDivision = async(divisionId:string,decodedToken:JwtPayload) =>{
   const isDivisionExits = await Division.findById(divisionId)
   if(!isDivisionExits){
    throw new AppError(httpStatus.NOT_FOUND, "division not found")
   }

    if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete this division");
  }

    const toursCount = await Tour.countDocuments({ division: divisionId });
  if (toursCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete division because it has associated tours"
    );
  }
   
   const deleteDivision = await Division.findByIdAndDelete(divisionId)

   return deleteDivision
 




  
   
}




export const divisionServices ={
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}