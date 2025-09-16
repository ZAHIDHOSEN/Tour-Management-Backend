/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors"
import express, { Request,Response } from 'express';
import { router } from "./app/routes";
import { globalErrHandler } from "./app/midlewares/globalErrHandlar";
import notFound from "./app/midlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import "./app/config/passport"
import { envVars } from "./app/config/env";
 




const app = express()
app.use(expressSession({
  secret: "your secret",
  resave:false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: envVars.FRONTEND_URL,
  credentials:true
}))


app.use("/api/V1", router)


 
 app.get('/',(req: Request, res: Response)=>{
   res.status(200).json({
    message: "welcome to tour management backend"
   })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrHandler)
app.use(notFound)
export default app