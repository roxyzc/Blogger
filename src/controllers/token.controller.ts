import Token from "../models/token.model";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateAccessToken, refreshToken } from "../utils/token.util";
import { logger } from "../libraries/Logger.library";

export const refreshAccessTokenOrRefreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token: any = await Token.findOne({ accessToken: req.user });
    if (!token)
      return res.status(400).json({ success: false, message: "Token invalid" });
    jwt.verify(
      token?.refreshToken as string,
      process.env.REFRESHTOKENSECRET as string,
      async (error: any, _decoded: any): Promise<any> => {
        const user = await User.findOne({ token: token.id }).select(
          "_id username email token"
        );
        if (!user)
          return res
            .status(401)
            .json({ success: false, message: "User not found" });
        console.log(user.role);
        if (error) {
          const { accessToken, refreshToken } = await generateAccessToken(
            user?.id as string,
            user?.role as string
          );
          await Object.assign(token, {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }).save();
          await user.populate("token");
          return res.status(200).json({
            success: true,
            data: { user },
          });
        }
        const { accessToken } = await refreshToken(
          user?.id as string,
          user?.role as string
        );
        await Object.assign(token, {
          accessToken,
        }).save();
        await user.populate("token");
        return res.status(200).json({ success: true, data: { user } });
      }
    );
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
