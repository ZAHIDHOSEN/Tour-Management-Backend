import AppError from "../../errHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.models";
import  httpStatus  from 'http-status-codes';
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async(payload: Partial<IUser>) =>{

         const {email,password,...rest} = payload
        //  const isUserExit = await User.findOne({email})
        //  if(isUserExit){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User Already exist")

        //  }

         const hashPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const authProvider: IAuthProvider = {provider: "credential",providerId: email as string}
        const user = await User.create({
          
            email,
            auths: [authProvider],
            password: hashPassword,
            ...rest
        })
        return user
}

const updateUser = async(userId:string, payload:Partial<IUser>,decodedToken:JwtPayload) =>{
   
  const isUserExits = await User.findById(userId)
  if(!isUserExits){
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
  }


  // name, phone,password, updated 
  // email cannot be updated  
  // password ---rehashing
  // admin and superAdmin can update the field 
  // promoting only super admin
if(payload.role === Role.USER || decodedToken.role === Role.GUIDE){
  throw new AppError(httpStatus.FORBIDDEN, "You are not authorize")
  
}

if(payload.role ===Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorize")
}

if(payload.isActive || payload.isDeleted || payload.isVerified){
  if(decodedToken.role === Role.USER || decodedToken.role ===Role.GUIDE){
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorize")

  }
}
if(payload.password){
  payload.password = await bcryptjs.hash(payload.password,envVars.BCRYPT_SALT_ROUND)

}

const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new: true,runValidators:true})
 

return newUpdatedUser
}


const getAllUser = async() =>{
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return{
      data: users,
      meta:{
        total: totalUser
      }
    }
}

const getMe = async(userId:string) =>{
   const user = await User.findById(userId).select("-password")


   return {
    data:user
   }
}
export const userServices = {
    createUser,
    getAllUser,
    updateUser,
    getMe
    
}