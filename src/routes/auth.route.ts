import { Router } from "express";
import {
  login,
  register,
  accountVerification,
  logout,
} from "../controllers/auth.controller";
import { limiter } from "../middlewares/limiter.middleware";
import {
  validateSchema,
  schema,
} from "../middlewares/validationSchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";

const route: Router = Router();

route.post(
  "/api/auth/register",
  limiter,
  validateSchema(schema.Auth.register),
  register
);

route.post(
  "/api/auth/login",
  limiter,
  validateSchema(schema.Auth.login),
  login
);
route.post(
  "/api/v-user",
  validateSchema(schema.Auth.login),
  accountVerification
);
route.delete("/api/auth/logout", verifyToken, logout);

export default route;
