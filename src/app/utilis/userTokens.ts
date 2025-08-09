import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errHelpers/appError";
import { isActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.models";
import { generateToken, verifyToken } from "./jwt";
import  httpStatus  from 'http-status-codes';

export const createUserTokens = (user:Partial<IUser>) =>{

     const jwtPayload = {
              userId: user._id,
              email: user.email,
              role: user.role,
    
            }
            const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
            const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

            return {
                accessToken,
                refreshToken
            }


}

export const createAccessTokenWithRefreshToken = async(refreshToken:string) =>{

    const verifyRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload

      const isUserExit = await User.findOne({email:verifyRefreshToken.email})
         if(!isUserExit){
          throw new AppError(httpStatus.BAD_REQUEST,"User does not exit")

         }
         if(isUserExit.isActive === isActive.BLOCKED || isUserExit.isActive === isActive.INACTIVE){
          throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")

         }
         if(isUserExit.isDeleted === true){
          throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted")

         }

           const jwtPayload = {
                       userId: isUserExit._id,
                       email: isUserExit.email,
                       role: isUserExit.role,
             
                     }
        const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

        return accessToken


}