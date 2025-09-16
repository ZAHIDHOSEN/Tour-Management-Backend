import dotenv from "dotenv"


dotenv.config()

interface EnvConfig {
  PORT: string
  DB_URL: string
  NODE_ENV: "development" | "production"
  BCRYPT_SALT_ROUND:string
  JWT_ACCESS_SECRET:string
  JWT_REFRESH_SECRET:string
  JWT_ACCESS_EXPIRES:string
  JWT_REFRESH_EXPIRES:string
  SUPER_ADMIN_EMAIL:string
  SUPER_ADMIN_PASS:string
  GOOGLE_CLIENT_ID:string
  GOOGLE_CLIENT_SECRET:string
  GOOGLE_CALLBACK_URL:string
  FRONTEND_URL:string
  EXPRESS_SESSION_SECRET:string
  SSL:{
    STORE_ID:string
    STORE_PASS:string
    SSL_PAYMENT_API:string
    SSL_VALIDATION_API:string
  }
}

const loadEnvVariable = () : EnvConfig =>{
    const requiredEnv: string[] = ["PORT", "DB_URL", "NODE_ENV","BCRYPT_SALT_ROUND",
      "JWT_ACCESS_SECRET","JWT_ACCESS_EXPIRES","SUPER_ADMIN_EMAIL","SUPER_ADMIN_PASS","JWT_REFRESH_SECRET",
      "JWT_REFRESH_EXPIRES","GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","GOOGLE_CALLBACK_URL","FRONTEND_URL",
      "EXPRESS_SESSION_SECRET","STORE_ID","STORE_PASS","SSL_PAYMENT_API","SSL_VALIDATION_API"]
     requiredEnv.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`Missing require enviroment variable ${key}`)
            
        }
     })
    return {
     PORT: process.env.PORT as string,
     DB_URL: process.env.DB_URL as string,
     NODE_ENV:process.env.NODE_ENV as "development" | "production",
     BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
     JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET as string,
     JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET as string,
     JWT_ACCESS_EXPIRES:process.env.JWT_ACCESS_EXPIRES as string,
     JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES as string,
     SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
     SUPER_ADMIN_PASS:process.env.SUPER_ADMIN_PASS as string,
     GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID as string,
     GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET as string,
     GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL as string,
     FRONTEND_URL:process.env.FRONTEND_URL as string,
     EXPRESS_SESSION_SECRET:process.env.EXPRESS_SESSION_SECRET as string, 
     SSL:{
          STORE_ID:process.env.STORE_ID as string,
          STORE_PASS:process.env.STORE_PASS as string,
          SSL_PAYMENT_API:process.env.SSL_PAYMENT_API as string,
          SSL_VALIDATION_API:process.env.SSL_VALIDATION_API as string
         }
    }
}
export const envVars = loadEnvVariable()
  

