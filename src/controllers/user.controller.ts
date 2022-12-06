import User from "../models/users.model";
import { logger } from "../libraries/Logger.library";
import { Request, Response } from "express";

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
          role: "admin",
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
