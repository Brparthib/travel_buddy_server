import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";

const router = Router();

router.post("/register",
validateRequest(createUserZodSchema),
userControllers.createUser);
// router.get("/", checkAuth(Role.ADMIN), userControllers.getAllUsers);
router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  userControllers.getUserById
);
router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  validateRequest(updateUserZodSchema),
  userControllers.updateUser
);
router.delete(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  userControllers.deletedUser
);


export const userRoutes = router;
