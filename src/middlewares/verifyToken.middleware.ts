import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../libraries/Logger.library";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res
        .status(401)
        .json({ success: false, message: "Please enter the token" });
    const token = authHeader?.split(" ")[1];
    jwt.verify(
      token as string,
      process.env.ACCESSTOKENSECRET as string,
      async (error: any, decoded: any): Promise<any> => {
        if (error)
          return res
            .status(403)
            .json({ success: false, message: "Invalid token" });
        req.user = decoded;
        console.log(req.user);
        next();
      }
    );
  } catch (error: any) {
    logger.error(error.message);
    throw new Error(error);
  }
};

export const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.role == "admin" || req.user.id === req.params.id)
        return next();
      return res
        .status(403)
        .json({ success: false, message: "You are not alowed to do that" });
    });
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
};

export const verifyTokenAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.role == "admin") return next();
      return res
        .status(403)
        .json({ success: false, message: "You are not alowed to do that" });
    });
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
};

export const checkExpired = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Invalid token" });
    const token = authHeader?.split(" ")[1];
    jwt.verify(
      token as string,
      process.env.ACCESSTOKENSECRET as string,
      async (err: any, _decoded: any): Promise<any> => {
        if (!err)
          return res
            .status(403)
            .json({ success: false, message: "Your token has not expired" });
        req.user = token;
        next();
      }
    );
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
};
