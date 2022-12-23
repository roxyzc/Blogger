import { Router } from "express";
import upload from "../config/multer.config";
import { createBlog } from "../controllers/blog.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
const route = Router();

route
  .route("/api/blog")
  .post(verifyToken, upload.single("thumbnail"), createBlog);

export default route;
