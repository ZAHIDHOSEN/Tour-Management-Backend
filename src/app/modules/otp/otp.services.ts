import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utilis/sendEmail"
import AppError from "../../errHelpers/appError"
import { User } from "../user/user.models"

const OTP_EXPIRATION = 2*60 //2 minute

const generateOtp = (length = 6)=>{

 const otp = crypto.randomInt(10**(length-1),10**length).toString() //10** means power 10 square

  return otp
}

const sendOTP = async(email:string, name:string)=>{

    const user = await User.findOne({email})
    if(!user){
      throw new AppError(401,"user not found")
     }

    if(user?.isVerified){
      throw new AppError(401,"you are already verified")
    }
    const otp = generateOtp()

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey,otp,{
        expiration: {
            type:"EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to:email,
        subject: "your otp code",
        templateName:"otp",
        templateData:{
          name: name,
          otp:otp,
          
        }

    })

}


const verifyOTP = async(email:string, otp:string)=>{
    
    // const user = await User.findOne({email,isVerified:false})
    const user = await User.findOne({email})
    if(!user){
     throw new AppError(401,"user is not found")
    }

     if(user?.isVerified){
      throw new AppError(401,"you are already verified")
    }
    

    const redisKey = `otp:${email}`

    const saveOtp = await redisClient.get(redisKey)

    if(!saveOtp){
        throw new AppError(401,"Invalid otp")
    }

    if(saveOtp !==otp){
        throw new AppError(401,"Invalid otp")
    }


    await Promise.all([
    User.updateOne({email},{isVerified:true},{runValidators:true}),
     redisClient.del(redisKey)
    ])
}







export const OTPServices = {
   sendOTP,
   verifyOTP
}