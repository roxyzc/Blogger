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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findBlog = async (req: Request, res: Response) => {
  const { limit = 10, title } = req.query;
  try {
    const blogs =
      title === undefined
        ? await Blog.find().limit(Number(limit))
        : await Blog.find({ title: title })
            .sort({ like: 1 })
            .limit(Number(limit));
    res.status(200).json({ success: true, message: blogs });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<any> => {
  const session = Blog.startSession();
  try {
    (await session).withTransaction(async (): Promise<any> => {
      const blog = await Blog.findByIdAndDelete(req.params.id).populate(
        "thumbnail"
      );
      if (!blog)
        return res
          .status(400)
          .json({ success: false, message: "Blog not found" });

      if (blog.thumbnail === null) {
        console.log(blog);
        (await session).abortTransaction();
        return res.status(200).json({ success: false });
      }
      await cloud.uploader.destroy(blog.thumbnail.cloudinary_id);
      return res.status(200).json({
        success: true,
        message: "The blog has been successfully deleted",
        blog,
      });
    });
  } catch (error: any) {
    (await session).abortTransaction();
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });

    let index = -1;
    const findId = blog.like?.filter((e: any, x): any => {
      if (String(e.userId).includes(String(req.user.id))) {
        index = x;
        return e.userId;
      }
    });

    if (index === -1 && findId?.length === 0) {
      blog.like?.push({ userId: req.user.id });
      await blog.save();
      return res
        .status(200)
        .json({ success: true, message: "successfully liked the blog" });
    }

    blog.like?.splice(index, 1);
    await blog.save();
    return res.status(200).json({ success: true, message: "cancel" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
