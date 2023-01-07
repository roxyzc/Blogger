import { Request, Response } from "express";
import User from "../models/user.model";
import Token from "../models/token.model";
import { logger } from "../libraries/Logger.library";
import { sendEmail } from "../utils/sendEmail.util";
import { generateAccessToken } from "../utils/token.util";
import { checkAdmin, createAdmin } from "../services/user.services";

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
          .status(500)
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
    const user =
      (await checkAdmin(email, password)) === false
        ? await User.findOne({ email })
        : await createAdmin();

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.valid != true || user.expiredAt != undefined) {
      return res.status(401).json({
        success: false,
        message:
          "The user hasn't been validated, please check your email to validate your account",
      });
    }

    if (
      (await user.comparePassword(password)) != true &&
      user.role === "user"
    ) {
      return res.status(400).json({
        success: false,
        message: "Password invalid",
      });
    }
    if (user.token == null || user.token == undefined) {
      const { accessToken, refreshToken } = await generateAccessToken(
        user.id as string,
        user.role as string
      );
      const createToken = await Token.create({ accessToken, refreshToken });
      Object.assign(user, { token: createToken._id });
    }
    const x = await (await user.save()).populate("token");
    return res.status(200).json({
      success: true,
      data: { user: x },
      message: "Login successfully",
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const accountVerification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const findUser = await User.findById(req.params.token).select(
      "id username email valid"
    );
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(findUser);
    if (findUser?.valid === true) {
      return res.status(400).json({
        success: false,
        message: "the user has been validated previously",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.token,
      {
        $set: {
          valid: true,
        },
        $unset: {
          expiredAt: 1,
        },
      },
      { new: true }
    ).select("id username email valid");
    return res.status(200).json({
      success: true,
      data: { user },
      message: "user has been validated",
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user.id).populate("token");
    if (!user) {
      return res.status(200).json({ success: true, message: "Logout" });
    }
    await Token.findByIdAndDelete(user.token._id);
    await user.$set("token", undefined).save();
    return res.status(200).json({ success: true, message: "Logout" });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
