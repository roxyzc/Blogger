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
