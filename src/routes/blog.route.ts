import { Router } from "express";
// import upload from "../config/multer.config";
import {
  createBlog,
  deleteBlog,
  findBlog,
  likeBlog,
} from "../controllers/blog.controller";
import { validateFile } from "../middlewares/validationFile.middleware";
import {
  validateSchema,
  schema,
} from "../middlewares/validationSchemas.middleware";
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from "../middlewares/verifyToken.middleware";
const route = Router();

route.get("/api/blog", findBlog);
route
  .route("/api/blog/:id")
  .post(
    verifyTokenAndAuthorization,
    validateFile,
    validateSchema(schema.Blog.createBlog),
    createBlog
  )
  .get(verifyToken, likeBlog)
  .delete(verifyTokenAndAuthorization, deleteBlog);

export default route;
