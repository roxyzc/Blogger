import { Router } from "express";
import { findComments } from "../controllers/comment.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
const route = Router();

route.get("/api/comments", verifyToken, findComments);

export default route;
