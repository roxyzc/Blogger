import Token from "../models/token.model";
import User from "../models/users.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateAccessToken, refreshToken } from "../utils/token.util";
import { logger } from "../libraries/Logger.library";

export const refreshAccessTokenOrRefreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token: any = await Token.findOne({ refreshToken: req.user.token });
    jwt.verify(
      token?.refreshToken as string,
      process.env.REFRESHTOKENSECRET as string,
      async (error: any, _decoded: any): Promise<any> => {
        const user = await User.findOne({ token: token?.id }).populate("token");
        if (!user)
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        if (error) {
          const { accessToken, refreshToken } = await generateAccessToken(
            user?.id as string,
            user?.role as string
          );
          Object.assign(token, {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }).save();
          return res.status(200).json({ success: true, data: { user } });
        }
        const { accessToken } = await refreshToken(
          user?.id as string,
          user?.role as string
        );
        Object.assign(token, {
          accessToken,
        }).save();
        return res.status(200).json({ success: true, data: { user } });
      }
    );
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
