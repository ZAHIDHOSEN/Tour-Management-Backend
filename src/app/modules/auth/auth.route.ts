import { NextFunction, Request, Response, Router } from "express";
import { AuthControlar } from "./auth.controlar";
import { checkAuth } from './../../midlewares/checkAuth';
import { Role } from "../user/user.interface";
import passport from "passport";


const router = Router()

router.post("/login", AuthControlar.credentialsLogin)
router.post("/refresh-token", AuthControlar.getNewAccessToken)
router.post("/logout",AuthControlar.logout)
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControlar.resetPassword)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google",async(req:Request, res:Response, next: NextFunction)=>{
    const redirect = req.query.redirect || "/"
    passport.authenticate("google",{scope: ["profile","email"],state:redirect as string})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect: "/login"}),AuthControlar.googleCallback)
export const AuthRoute = router