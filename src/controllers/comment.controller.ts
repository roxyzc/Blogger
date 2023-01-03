import Comment from "../models/comment.model";
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

export const comment = async (req: Request, res: Response): Promise<any> => {
  const { content } = req.body.content;
  try {
    const findComment = await Comment.findById(req.params.id);
    if (!findComment)
      return res
        .status(400)
        .json({ success: false, message: "comment not found" });
    const comment = await Comment.create({
      userId: req.user.id,
      content: content,
    });
    findComment?.comment.push(comment.id);
    await (await findComment?.save()).populate("commentId");
    res.status(200).json({ success: true, data: findComment });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
