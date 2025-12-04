
import {Router} from "express";
import { PaymentController } from "./payment.controller";



const router = Router()
router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success",PaymentController.successPayment)
router.post("/fail",PaymentController.failPayment)
router.post("/cancel",PaymentController.cancelPayment)
router.get("/invoice/:paymentId",PaymentController.getInvoiceDownUrl)
router.post("/validate-Payment",PaymentController.validatePayment)


export const PaymentRoute = router