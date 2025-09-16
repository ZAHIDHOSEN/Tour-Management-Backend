import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoute } from "../modules/auth/auth.route"
import { DivisionRoute } from "../modules/division/division.route"
import { TourRoute } from "../modules/tour/tour.routes"
import { BookingRoute } from "../modules/booking/booking.route"




export const router = Router()

const modulesRoute = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route:AuthRoute
    },
    {
        path: "/division",
        route: DivisionRoute
    },
    {
        path: "/tour",
        route: TourRoute
    },
    {
        path: "/booking",
        route: BookingRoute
    }
]

modulesRoute.forEach((route)=>{
    router.use(route.path, route.route)
   
})

