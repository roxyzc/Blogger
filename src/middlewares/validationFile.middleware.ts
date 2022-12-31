import upload from "../config/multer.config";
import { Request, Response, NextFunction } from "express";

export const validateFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return upload.single("image")(req, res, (): any => {
    if (req.file === undefined) return next();
    req.body.image = req.file;
    next();
  });
};
