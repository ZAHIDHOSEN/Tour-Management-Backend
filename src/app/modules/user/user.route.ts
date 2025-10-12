
import { UserControllers } from "./user.controlar";

import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../midlewares/validateRequest";
import {Router} from "express";

import { checkAuth } from "../../midlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()





router.post('/register',
    validateRequest(createUserZodSchema),
    UserControllers.createUser)
router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),UserControllers.getAllUser)
router.get("/me",checkAuth(...Object.values(Role)),UserControllers.getMe)
router.patch("/:id",validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserControllers.updateUser)
export const UserRoutes = router