import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { NotFound } from "http-errors";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound());
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
};
