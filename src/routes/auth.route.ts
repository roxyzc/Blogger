import { Router } from "express";
import { register } from "../controllers/auth.controller";
import {
  validateSchema,
  schema,
} from "../middlewares/validationSchemas.middleware";

const route: Router = Router();

route.post(
  "/api/auth/register",
  validateSchema(schema.Auth.register),
  register
);

export default route;
