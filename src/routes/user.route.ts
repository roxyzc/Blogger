import { Router } from "express";
import {
  changeAvatar,
  changeProfile,
  findAllUserAndQuery,
} from "../controllers/user.controller";
import {
  vChangePassword,
  forgotThePassword,
  verifyOTP,
} from "../controllers/fPassword.controller";
import {
  schema,
  validateSchema,
} from "../middlewares/validationSchemas.middleware";
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from "../middlewares/verifyToken.middleware";
import { validateFile } from "../middlewares/validationFile.middleware";

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

route.put(
  "/api/user/:id",
  verifyTokenAndAuthorization,
  validateSchema(schema.User.profile),
  changeProfile
);

route.post(
  "/api/avatarUser/:id",
  verifyTokenAndAuthorization,
  validateFile,
  validateSchema(schema.User.changeAvatarUser),
  changeAvatar
);
export default route;
