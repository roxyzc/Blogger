import User from "../models/user.model";
import { logger } from "../libraries/Logger.library";
import { Request, Response } from "express";
import Avatar from "../models/avatar.model";
import cloud from "../config/cloudinary.config";
import { hash } from "../utils/hashing.util";

export const findAllUserAndQuery = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, limit = 10 } = req.query;
  try {
    const users = username
      ? await User.find({
          username: { $regex: username },
          role: "user",
        })
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .select("username email valid")
      : await User.find({
          role: "user",
        })
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .select("username email valid");
    console.log(users);
    return res.status(200).json({ success: true, data: { users } });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changeAvatar = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    if (req.file === undefined) {
      const avatar = await Avatar.findByIdAndDelete(user.image);
      if (!avatar)
        return res.status(400).json({ success: false, message: "Bad request" });
      await user.$set("image", undefined).save();
      res
        .status(200)
        .json({ success: false, message: "avatar successfully changed" });
    }
    const result = await cloud.uploader.upload(req.file?.path as string);
    if (user.image === undefined) {
      const avatar = await Avatar.create({
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      });
      await (user.image = avatar.id).save();
      return res.status(200).json({
        success: true,
        message: "avatar successfully changed",
        profile: avatar,
      });
    }
    await user
      .populate("image")
      .then(() => cloud.uploader.destroy(user.image.cloudinary_id));
    // await cloud.uploader.destroy(user.image.cloudinary_id);
    const avatar = await Avatar.findByIdAndUpdate(
      user.image,
      {
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "avatar successfully changed",
      profile: avatar,
    });
  } catch (error: any) {
    // logger.error(error.message);
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changeProfile = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        password: await hash(password),
      },
      { new: true }
    ).select("_id username email password role valid image");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "Profile successfully changed",
      data: { user },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error });
  }
};
