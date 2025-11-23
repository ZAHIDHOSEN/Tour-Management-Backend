import { NextFunction, Request, Response, Router } from "express";
import { AuthControlar } from "./auth.controlar";
import { checkAuth } from './../../midlewares/checkAuth';
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const router = Router()

router.post("/login", AuthControlar.credentialsLogin)
router.post("/refresh-token", AuthControlar.getNewAccessToken)
router.post("/logout",AuthControlar.logout)
router.post("/change-password",checkAuth(...Object.values(Role)),AuthControlar.changePassword)
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControlar.resetPassword)
router.post("/set-password",checkAuth(...Object.values(Role)),AuthControlar.setPassword)
router.post("/forgot-password",AuthControlar.forgotPassword)



// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google",async(req:Request, res:Response, next: NextFunction)=>{
    const redirect = req.query.redirect || "/"
    passport.authenticate("google",{scope: ["profile","email"],state:redirect as string})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your account.
    please contact our support team`}),AuthControlar.googleCallback)
export const AuthRoute = router