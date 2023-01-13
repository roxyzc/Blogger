import { Router } from "express";
import {
  replyComment,
  findComments,
  findReplyComments,
  deleteComment,
  deleteReplyComment,
} from "../controllers/comment.controller";
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from "../middlewares/verifyToken.middleware";
const route = Router();

route.get("/api/comments", verifyToken, findComments);
route
  .route("/api/comment/:id")
  .post(verifyToken, replyComment)
  .delete(verifyTokenAndAuthorization, deleteComment);
route.get("/api/replyComments", verifyToken, findReplyComments);
route
  .route("/api/replyComment/:id")
  .delete(verifyTokenAndAuthorization, deleteReplyComment);

export default route;
