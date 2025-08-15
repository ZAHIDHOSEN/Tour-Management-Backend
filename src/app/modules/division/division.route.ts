import { Router } from "express";
import { validateRequest } from "../../midlewares/validateRequest";
import { createDivisionZodScheme, updateDivisionZodSchema } from "./division.validation";
import { divisionController } from "./division.controller";
import { checkAuth } from './../../midlewares/checkAuth';
import { Role } from "../user/user.interface";


const router = Router()

router.post("/create-division",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
validateRequest(createDivisionZodScheme),
divisionController.createDivision)

router.get("/all-division",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),divisionController.getAllDivision)
router.get("/single-division",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),divisionController.getSingleDivision)
router.patch("/:id",validateRequest(updateDivisionZodSchema),checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.updateDivision)
router.delete("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),divisionController.deleteDivision)

export const DivisionRoute= router


// 