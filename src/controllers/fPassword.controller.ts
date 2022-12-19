import User from "../models/user.model";
import { logger } from "../libraries/Logger.library";
import { Request, Response } from "express";
import OTP from "../models/otp.model";
import { generateOTP } from "../services/otp.service";
import { hash, compare } from "../utils/hashing.util";
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

      const findOtp = await OTP.findOne({ email });
      if (findOtp)
        return res.status(400).json({ success: false, message: "OTP exist" });

      const otp: string = generateOTP();
      const createOTP = await OTP.create({
        OTP: await hash(otp),
        email,
      });
      const valid = await sendOTPWithEmail(email, otp);
      if (!valid) {
        (await session).abortTransaction();
        return res
          .status(500)
          .json({ success: false, message: "failed to send email" });
      }
      return res
        .status(200)
        .json({ success: true, message: "check your email", id: createOTP.id });
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
  const { otp } = req.body;
  try {
    const findOtp = await OTP.findById(req.params.id);
    if (!findOtp) {
      return res.sendStatus(401);
    }
    const valid = await compare(otp as string, findOtp?.OTP as string);
    if (!valid) {
      return res.status(400).json({ success: false, message: "OTP invalid" });
    }
    await findOtp.set("verify", true).save();
    return res.status(200).json({ success: true, id: findOtp.id });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const vChangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { password } = req.body;
  try {
    const findOtp = await OTP.findById(req.params.id);
    if (!findOtp || findOtp.verify === false) {
      return res.sendStatus(401);
    }

    const user = await User.findOne({ email: findOtp.email });
    if (!user) {
      return res.sendStatus(401);
    }
    const checkPassword = await compare(password, user.password as string);
    if (checkPassword === true)
      return res
        .status(400)
        .json({ success: false, message: "The password is same" });
    user.password = password;
    user.save();
    findOtp.delete();
    return res
      .status(200)
      .json({ success: true, message: "successfully changed password" });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
