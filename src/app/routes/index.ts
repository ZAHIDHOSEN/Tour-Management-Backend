import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoute } from "../modules/auth/auth.route"
import { DivisionRoute } from "../modules/division/division.route"
import { TourRoute } from "../modules/tour/tour.routes"
import { BookingRoute } from "../modules/booking/booking.route"

import { PaymentRoute } from "../modules/payment/payment.route"

import { OTPRoute } from "../modules/otp/otp.route"
import { StatsRoute } from "../modules/stats/stats.route"




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
    },
    {
        path:"/payment",
        route: PaymentRoute
    },
    {
        path:"/otp",
        route:OTPRoute
    },
    {
        path:"/stats",
        route:StatsRoute
    }
]

modulesRoute.forEach((route)=>{
    router.use(route.path, route.route)
   
})

