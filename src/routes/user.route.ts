import { Router } from "express";
import { findAllUserAndQuery } from "../controllers/user.controller";
import {
  changePassword,
  forgotThePassword,
} from "../controllers/fPassword.controller";
import {
  schema,
  validateSchema,
} from "../middlewares/validationSchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";

const route: Router = Router();

route.route("/api/users").get(verifyToken, findAllUserAndQuery);
route.post(
  "/api/f-password",
  validateSchema(schema.User.forgotThePassword),
  forgotThePassword
);

route.post("/api/f-password/changePassword", changePassword);

export default route;
