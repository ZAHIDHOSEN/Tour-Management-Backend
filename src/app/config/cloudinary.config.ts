/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errHelpers/appError";
import stream from "stream"




cloudinary.config({
    cloud_name:envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key:envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVars.CLOUDINARY.CLOUDINARY_API_SECRET

})

export const uploadBufferCloudinary = async(buffer:Buffer,filename:string):Promise<UploadApiResponse | undefined> =>{
    try {
        return new Promise((resolve,reject)=>{
            const public_id =`pdf/${filename}-${Date.now()}`
            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer)

            cloudinary.uploader.upload_stream(
                {
                   resource_type:"auto",
                   public_id: public_id,
                   folder:"pdf"
                },
                (error,result)=>{
                    if(error){
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer)
        })
    } catch (error:any) {
       console.log(error)
       throw new AppError(401,`Error uploading file ${error.message}`)
    }

}

export const deleteFromCloudinary = async(url:string) =>{
 try {
      const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i
  const match = url.match(regex)
  console.log({match})
  
  if(match && match[1]){
    const public_id= match[1]
    // console.log("deleting public id",public_id)
   await cloudinary.uploader.destroy(public_id)
   console.log(`File ${public_id} is deleted from cloudinary`)
  }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 } catch (error:any) {
    throw new AppError(401,"cloudinary image deleted",error.message)
 }
} 

export const cloudinaryUpload = cloudinary



