/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.models";
import { isActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import  bcryptjs  from 'bcryptjs';
// import AppError from "../errHelpers/appError";
// import  httpStatus  from 'http-status-codes';



passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },async(email:string, password:string,done)=>{
        try {
        const isUserExit = await User.findOne({email})
         if(!isUserExit){
         return done(null,false,{message:"user does not exits"})

         }

         if(!isUserExit.isVerified){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is Verified")
            return done(`user is not verified`)
         }

           if(isUserExit.isActive === isActive.BLOCKED || isUserExit.isActive === isActive.INACTIVE){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")
            return done(`User is blocked ${isUserExit.isActive}`)

         }
         if(isUserExit.isDeleted === true){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted")
           return done(`user is deleted`)

         }
      

         const googleAuthenticated = isUserExit.auths.some(providerObjects => providerObjects.provider =='google')
         if(googleAuthenticated && !isUserExit.password){
          return done(null, false,{message:"you are authenticated by google.so login and set password"})
         }
         
        const isPasswordMatch = await bcryptjs.compare(password as string,isUserExit.password as string)
        if(!isPasswordMatch){
           return done(null,false,{message:"password does not match"})

        }
        return done(null,isUserExit)


        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)
passport.use(
    new GoogleStrategy(
        {
            clientID:envVars.GOOGLE_CLIENT_ID,
            clientSecret:envVars.GOOGLE_CLIENT_SECRET,
            callbackURL:envVars.GOOGLE_CALLBACK_URL
        },async (accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback) =>{
            try{
               const email = profile.emails?.[0].value
               if(!email){
                return done(null, false,{message: 'email does not exits'})
               }
               let isUserExit= await User.findOne({email})

        if( isUserExit && !isUserExit.isVerified){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is Verified")
           return done(null,false,{message: "user is not verified"})
         }

           if(isUserExit && (isUserExit.isActive === isActive.BLOCKED || isUserExit.isActive === isActive.INACTIVE)){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")
         return done(null,false,{message: "user is not active"})

         }
         if(isUserExit && (isUserExit.isDeleted === true)){
        //   throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted")
             return done(null,false,{message: "user is deleted"})

         }
               if(!isUserExit){
                isUserExit = await User.create({
                    email,
                    name: profile.displayName,
                    picture:profile.photos?.[0].value,
                    role:Role.USER,
                    isVerified:true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                 })
               }
               return done(null, isUserExit)
            }catch(err){
                console.log(err,"google stategy error");
                return done(err)
            }
        }
        
    )
)




// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
})

passport.deserializeUser(async(id:string,done:any)=>{
    try{
      const user = await User.findById(id)
      done(null, user)
    }catch(err){
       done(err)
    }
})