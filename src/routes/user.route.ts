import { Router } from "express";
import {
  banUser,
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
  verifyTokenAdmin,
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

route.post("/api/verifyOtp", validateSchema(schema.User.verifyOTP), verifyOTP);

route.post(
  "/api/v-changePassword/:id",
  validateSchema(schema.User.vChangePassword),
  vChangePassword
);

route
  .route("/api/user/:id")
  .put(
    verifyTokenAndAuthorization,
    validateSchema(schema.User.profile),
    changeProfile
  )
  .post(
    verifyTokenAndAuthorization,
    validateFile,
    validateSchema(schema.User.changeAvatarUser),
    changeAvatar
  );

route.put(
  "/api/banUser/:id",
  verifyTokenAdmin,
  validateSchema(schema.User.banUser),
  banUser
);
export default route;
