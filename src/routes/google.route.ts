import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import passport from "passport";
import { logger } from "../libraries/Logger.library";

const route = Router();

route.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/api/auth/callback",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate(
        "google",
        {
          failureRedirect: "/api/auth/failure",
        },
        (error, user, _info): any => {
          if (error) return res.status(400).json({ success: false, error });
          req.login(user, (error) => {
            if (error) throw new Error(error);
            req.session.passport = { login: true };
            console.log(req.session);
            return res.status(200).json({ success: true, data: user });
          });
        }
      )(req, res, next);
    } catch (error: any) {
      logger.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default route;
