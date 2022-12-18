import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "please do it again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
