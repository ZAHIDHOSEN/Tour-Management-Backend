import { Router } from "express";
import { validateRequest } from "../../midlewares/validateRequest";
import { createDivisionZodScheme, updateDivisionZodSchema } from "./division.validation";
import { divisionController } from "./division.controller";
import { checkAuth } from './../../midlewares/checkAuth';
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";


const router = Router()

router.post("/create-division",
checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
multerUpload.single("file"),
validateRequest(createDivisionZodScheme),
divisionController.createDivision)

router.get("/all-division",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),divisionController.getAllDivision)
router.get("/single-division",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),divisionController.getSingleDivision)
router.patch("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),multerUpload.single("file"),validateRequest(updateDivisionZodSchema),divisionController.updateDivision)
router.delete("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),divisionController.deleteDivision)

export const DivisionRoute= router


// 