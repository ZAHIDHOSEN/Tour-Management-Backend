import { Router } from "express";
import { checkAuth } from "../../midlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../midlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { tourController } from "./tour.controlar";


const router = Router()
// tourType route

router.post("/create-tour-type",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourTypeZodSchema),tourController.createTourType)
router.get("/all-tour-type",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),tourController.getAllTourType)
router.patch("/tour-type/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourTypeZodSchema),tourController.updatedTourType)
router.delete("/tour-type/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),tourController.deleteTourType)
// tour route
router.post("/create-tour",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourZodSchema),tourController.createTour)
router.get("/all-tour",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),tourController.getAllTour)
router.patch("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(updateTourZodSchema),tourController.updateTour)
router.delete("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),tourController.deleteTour)
export const TourRoute = router