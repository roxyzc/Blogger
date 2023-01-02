import { Router } from "express";
import {
  commentBlog,
  createBlog,
  deleteBlog,
  findBlog,
  findBlogs,
  findBlogsWithId,
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

route.get("/api/blogs", findBlogs);
route.get("/api/blogs/:id", verifyTokenAndAuthorization, findBlogsWithId);
route
  .route("/api/blog/:id")
  .post(
    verifyTokenAndAuthorization,
    validateFile,
    validateSchema(schema.Blog.createBlog),
    createBlog
  )
  .get(verifyToken, findBlog)
  .delete(verifyTokenAndAuthorization, deleteBlog);

route.get("/api/blog/like/:id", verifyToken, likeBlog);
route.post(
  "/api/blog/comment/:id",
  verifyToken,
  validateSchema(schema.comment),
  commentBlog
);

export default route;
