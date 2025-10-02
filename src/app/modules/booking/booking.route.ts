import { Router } from "express";
import { checkAuth } from "../../midlewares/checkAuth";
import { Role } from "../user/user.interface";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../midlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";



const router = Router()

router.post("/create-booking",checkAuth(...Object.values(Role)),validateRequest(createBookingZodSchema),bookingController.createBooking)

router.get("/:bookingId",checkAuth(...Object.values(Role)),bookingController.getSingleBooking)
router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN))

export const BookingRoute = router


