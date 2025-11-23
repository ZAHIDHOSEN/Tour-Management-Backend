/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errHelpers/appError";
import {  IAuthProvider, isActive, IUser } from "../user/user.interface"
import  httpStatus  from 'http-status-codes';
import { User } from "../user/user.models";
import bcryptjs from "bcryptjs"
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utilis/userTokens";
import {  JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utilis/sendEmail";





const credentialsLogin = async(payload : Partial<IUser>) => {
  const {email,password} = payload;

   const isUserExit = await User.findOne({email})
         if(!isUserExit){
          throw new AppError(httpStatus.BAD_REQUEST,"User does not exit")

         }

         const isPasswordMatch = await bcryptjs.compare(password as string,isUserExit.password as string)
        if(!isPasswordMatch){
          throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")

        }

        const usersToken = createUserTokens(isUserExit)
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password:pass,...rest} = isUserExit.toObject()
       
        return {
         
          accessToken:usersToken.accessToken,
          refreshToken:usersToken.refreshToken,
          user: rest
        }

}

const getNewAccessToken = async(refreshToken: string) => {

           const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken)    
       
        return {
         
          accessToken:newAccessToken
         
        }

}

const changePassword = async(oldPassword:string, newPassword:string,decodedToken:JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    
    if(!user){
      throw new AppError(httpStatus.UNAUTHORIZED, 'user not found')

    }
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string)

    if(!isOldPasswordMatch){
      throw new AppError(httpStatus.UNAUTHORIZED, 'old password dose not match')

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.save()
          
      return true;

}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetPassword = async( payload:Record<string,any>,decodedToken:JwtPayload) => {
   if(payload.id != decodedToken.userId){
    throw new AppError(httpStatus.BAD_GATEWAY,"you can't reset password")
   }

   const isUserExit = await User.findById(decodedToken.userId)
    if(!isUserExit){
      throw new AppError(401,"user does not exists")
    }  
    
    const hashPassword = await bcryptjs.hash(
      payload.newPassword,
      Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExit.password = hashPassword

    await isUserExit.save()
     

}

const setPassword = async(userId:string,planPassword:string) => {
   const user = await User.findById(userId)

   if(!user){
    throw new AppError(httpStatus.NOT_FOUND,"user dosenot exist")
   }

   if(user.password && user.auths.some(providerObject => providerObject.provider ==="google")){
     throw new AppError(httpStatus.BAD_REQUEST, "you have already set your password.now change your password")
   }
          
      const existingPassword = await bcryptjs.hash(
        planPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
      )

      const credentialProvider: IAuthProvider ={
        provider:"credential",
        providerId:user.email
      } 

      const auths:IAuthProvider[] = [...user.auths,credentialProvider]
     
      user.password = existingPassword
      user.auths = auths
      await user.save()
}


const forgotPassword = async(email:string) => {
   const isUserExit = await User.findOne({email})

   if(!isUserExit){
          throw new AppError(httpStatus.BAD_REQUEST,"User does not exit")

    }
   if(isUserExit.isActive === isActive.BLOCKED || isUserExit.isActive === isActive.INACTIVE){
          throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")

    }
   if(isUserExit.isDeleted === true){
          throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted")

    }
  if(!isUserExit.isVerified){
          throw new AppError(httpStatus.BAD_REQUEST,"User is not Verified")
    }

const JwtPayload = {
  userId: isUserExit._id,
  email:isUserExit.email,
  role: isUserExit.role
}

const resetToken = jwt.sign(JwtPayload,envVars.JWT_ACCESS_SECRET,{
  expiresIn:"10m"
})

const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExit._id}
&token=${resetToken}`

sendEmail({
  to: isUserExit.email,
  subject: "password reset",
  templateName: "forgotPassword",
  templateData:{
    name:isUserExit.name,
    resetUILink
  }
  


})


// http://localhost:5173/reset-password?id=6913038e095435ad8acbe079&
// token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEzMDM4ZTA5NTQzNWFkOGFjYmUwNzkiLCJlbWFpbCI6InphaGlkaG9zZW43MjdAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NjI4NTQxNTMsImV4cCI6MTc2Mjg1NDc1M30.clDeiRgzlJTe1JaEC7NeL9XRfbF3MR_b7Jk2Vu5IeUw







  
}


/*http://localhost:5173/reset-password?id=6913038e095435ad8acbe079&
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEzMDM4ZTA5NTQzNWFkOGFjYmUwNzkiLCJlbWFpbCI6InphaGlkaG9zZW43MjdAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NjMwMDc2MTEsImV4cCI6MTc2MzAwODIxMX0.BovQCx3p-XY5nKNslzczzInZteXIOred-yhf1qt7oGE
*/


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    changePassword,
    forgotPassword,
    setPassword,
    resetPassword
}