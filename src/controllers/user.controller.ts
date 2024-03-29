import User from "../models/user.model";
import { logger } from "../libraries/Logger.library";
import { Request, Response } from "express";
import Avatar from "../models/avatar.model";
import cloud from "../config/cloudinary.config";

export const findAllUserAndQuery = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, limit = 10 } = req.query;
  try {
    const users = username
      ? await User.find({
          username: { $regex: username },
          role: { $ne: "admin" },
        })
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .select("username email valid")
      : await User.find({
          role: { $ne: "user" },
        })
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .select("username email valid");
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
    if (user.role === "gmail")
      return res
        .status(403)
        .json({ success: false, message: "You are not alowed to do that" });
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
    if (user.image === undefined || user.image === null || user.image === "") {
      const avatar = await Avatar.create({
        image: result.secure_url,
        cloudinary_id: result.public_id,
      });
      await user.$set("image", avatar.id).save();
      return res.status(200).json({
        success: true,
        message: "avatar successfully changed",
        profile: avatar,
      });
    }
    await user
      .populate("image")
      .then(() => cloud.uploader.destroy(user.image.cloudinary_id));
    const avatar = await Avatar.findByIdAndUpdate(
      user.image,
      {
        image: result.secure_url,
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
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAvatar = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.json(400).json({ success: false, message: "User not found" });
    if (user.role === "gmail")
      return res
        .status(403)
        .json({ success: false, message: "You are not alowed to do that" });
    await user
      .populate("image")
      .then(() => cloud.uploader.destroy(user.image.cloudinary_id));
    await Avatar.findByIdAndDelete(user.image.id);
    user.$set("image", undefined).save();
    return res
      .status(200)
      .json({ success: true, message: "delete photo profile successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const banUser = async (req: Request, res: Response): Promise<any> => {
  const { valid } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $ne: "admin" } },
      { $set: { valid: valid } },
      { new: true }
    ).select("username email valid role");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.status(200).json({ success: true, data: { user } });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeProfile = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findById(req.params.id).select(
      "username email password image"
    );

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if ((!username && !password) || username === user.username)
      return res.sendStatus(400);
    if (username !== undefined) user.username = username;
    if (password !== undefined) {
      if (await user.comparePassword(password)) return res.sendStatus(400);
      user.password = password;
    }
    await user.save();
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
