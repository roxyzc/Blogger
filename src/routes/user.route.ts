import { Router } from "express";
import { findAllUserAndQuery } from "../controllers/user.controller";
import {
  vChangePassword,
  forgotThePassword,
  verifyOTP,
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

route.post(
  "/api/verifyOtp/:id",
  validateSchema(schema.User.verifyOTP),
  verifyOTP
);

route.post(
  "/api/v-changePassword/:id",
  validateSchema(schema.User.vChangePassword),
  vChangePassword
);
export default route;
