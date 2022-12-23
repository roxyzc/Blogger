import Blog from "../models/blog.model";
import Avatar from "../models/avatar.model";
import { Request, Response } from "express";
import cloud from "../config/cloudinary.config";
import { logger } from "../libraries/Logger.library";

export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file?.path as string,
      { transformation: { width: 1200, height: 800 } }
    );
    const thumbnail = await Avatar.create({
      image: secure_url,
      cloudinary_id: public_id,
    });

    const blog = await Blog.create({
      userId: req.user.id,
      title,
      content,
      thumbnail: thumbnail.id,
    });

    res.status(200).json({
      success: true,
      message: "managed to create a blog",
      data: { blog },
    });
  } catch (error: any) {
    logger.error(error.message);
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};
