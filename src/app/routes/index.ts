import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoute } from "../modules/auth/auth.route"



export const router = Router()

const modulesRoute = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route:AuthRoute
    }
]

modulesRoute.forEach((route)=>{
    router.use(route.path, route.route)
   
})

