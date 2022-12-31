import { Router } from "express";
// import upload from "../config/multer.config";
import { createBlog } from "../controllers/blog.controller";
import { validateFile } from "../middlewares/validationFile.middleware";
import {
  validateSchema,
  schema,
} from "../middlewares/validationSchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
const route = Router();

route
  .route("/api/blog")
  .post(
    verifyToken,
    validateFile,
    validateSchema(schema.Blog.createBlog),
    createBlog
  );

export default route;
