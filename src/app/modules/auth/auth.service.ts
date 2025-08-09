import AppError from "../../errHelpers/appError";
import {  IUser } from "../user/user.interface"
import  httpStatus  from 'http-status-codes';
import { User } from "../user/user.models";
import bcryptjs from "bcryptjs"
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utilis/userTokens";
import {  JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env";





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
const resetPassword = async(oldPassword:string, newPassword:string,decodedToken:JwtPayload) => {
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


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}