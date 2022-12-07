import User from "../models/users.model";
import { logger } from "../libraries/Logger.library";
import { NextFunction, Request, Response } from "express";
import OTP from "../models/otp.model";
import { generateOTP } from "../services/otp.service";
import { sendOTPWithEmail } from "../utils/sendEmail.util";

export const forgotThePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;
  const session = User.startSession();
  try {
    (await session).withTransaction(async (): Promise<any> => {
      const user = await User.findOne({ email }).select("email");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "unregistered email" });
      const findOTP = await OTP.findOne({ email });
      if (findOTP)
        return res.status(400).json({ success: false, message: "OTP exist" });
      const otp = await OTP.create({ email, OTP: generateOTP() });
      const valid = await sendOTPWithEmail(otp);
      if (!valid) {
        (await session).abortTransaction();
        return res
          .status(500)
          .json({ success: false, message: "failed to send email" });
      }
      return res
        .status(200)
        .json({ success: true, message: "check your email" });
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { otp } = req.body;
  try {
    const otpUser = await OTP.findOneAndDelete({ OTP: otp });
    if (!otpUser)
      return res.status(404).json({ success: false, message: "OTP invalid" });
    req.user = { email: otpUser.email };
    next();
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { password } = req.body;
  try {
    verifyOTP(req, res, async (): Promise<any> => {
      const user = await User.findOne({ email: req.user.email });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      user.password = password;
      await user.save();
      return res.status(200).json({ success: true, message: "Success" });
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
