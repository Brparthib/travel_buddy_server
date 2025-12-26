import { Router } from "express";
import { ModuleRoute } from "../interfaces/interfaces";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
