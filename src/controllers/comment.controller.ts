import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Blog from "../models/blog.model";
import { Request, Response } from "express";
import { logger } from "../libraries/Logger.library";

export const findComments = async (_req: Request, res: Response) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json({ success: true, data: comments });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deleteComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deleteComment)
      return res
        .status(400)
        .json({ success: false, message: "comment not found" });
    const findBlog = await Blog.findById(deleteComment?.blogId);
    findBlog?.comment?.forEach(async (x: any, index) => {
      if (String(x.commentId) === req.params.id) {
        findBlog?.comment?.splice(index, 1);
      }
    });
    await findBlog?.save();
    await ReplyComment.deleteMany({ commentId: req.params.id });
    res.status(200).json({ success: true, data: deleteComment });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res
        .status(400)
        .json({ success: false, message: "comment not found" });

    let index = -1;
    const findId = comment.like?.filter((e: any, x): any => {
      if (String(e.userId).includes(String(req.USER.id))) {
        index = x;
        return e.userId;
      }
    });

    if (index === -1 && findId?.length === 0) {
      comment.like?.push({ userId: req.USER.id });
      await comment.save();
      return res
        .status(200)
        .json({ success: true, message: "successfully liked the blog" });
    }
    comment.like?.splice(index, 1);
    await comment.save();
    return res.status(200).json({ success: true, message: "cancel" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findReplyComments = async (_req: Request, res: Response) => {
  try {
    const ReplyComments = await ReplyComment.find({});
    res.status(200).json({ success: true, data: ReplyComments });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { content } = req.body;
  try {
    const findComment = await Comment.findById(req.params.id);
    if (!findComment)
      return res
        .status(400)
        .json({ success: false, message: "comment not found" });
    const comment = await ReplyComment.create({
      userId: req.USER.id,
      commentId: findComment.id,
      content: content,
    });
    findComment?.comment.push({ commentId: comment.id });
    await (await findComment?.save()).populate("comment.commentId");
    res.status(200).json({ success: true, data: findComment });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReplyComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deleteReplyComment = await ReplyComment.findByIdAndDelete(
      req.params.id
    );
    if (!deleteReplyComment)
      return res
        .status(400)
        .json({ success: false, message: "comment not found" });
    res
      .status(200)
      .json({ success: true, message: "success", data: deleteReplyComment });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ succes: false, message: error.message });
  }
};
