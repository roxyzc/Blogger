import { Router } from "express";
import {
  login,
  register,
  accountVerification,
  logout,
} from "../controllers/auth.controller";
import {
  validateSchema,
  schema,
} from "../middlewares/validationSchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";

const route: Router = Router();

route.post(
  "/api/auth/register",
  validateSchema(schema.Auth.register),
  register
);

route.post("/api/auth/login", validateSchema(schema.Auth.login), login);
route.get("/api/v-user/:token", accountVerification);
route.delete("/api/auth/logout", verifyToken, logout);

export default route;
