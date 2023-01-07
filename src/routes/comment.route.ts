import { Router } from "express";
import {
  comment,
  findComments,
  findReplyComments,
} from "../controllers/comment.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
const route = Router();

route.get("/api/comments", verifyToken, findComments);
route.get("/api/replyComments", verifyToken, findReplyComments);

route.route("/api/comment/:id").post(verifyToken, comment);

export default route;
