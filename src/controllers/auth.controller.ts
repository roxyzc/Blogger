import { Request, Response } from "express";
import User from "../models/users.model";
import { logger } from "../libraries/Logger.library";
import { sendEmail } from "../utils/sendEmail.util";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const session = User.startSession();

  try {
    (await session).withTransaction(async (): Promise<any> => {
      const findUser = await User.findOne(
        {
          $or: [{ email }, { username, email }],
        },
        { username: 1, email: 1, id: 1 }
      );
      if (findUser != null || findUser != undefined) {
        return res
          .status(400)
          .json({ success: false, message: "account already exists" });
      }
      const user = await User.create({
        username,
        email,
        password,
      });
      user.save();
      const valid: Boolean = await sendEmail(req, user);
      if (!valid) {
        (await session).abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "failed to send email" });
      }
      return res
        .status(200)
        .json({ success: true, message: "account registered successfully" });
    });
  } catch (error: any) {
    logger.error(error.message);
  } finally {
    (await session).endSession();
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.valid != true || user.expiredAt != undefined) {
      return res.status(401).json({
        success: false,
        message:
          "The user hasn't been validated, please check your email to validate your account",
      });
    }
    if ((await user.comparePassword(password)) != true) {
      return res.status(400).json({
        success: false,
        message: "Password invalid",
      });
    }
    return res
      .status(200)
      .json({ success: true, data: { user }, message: "Login successfully" });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
