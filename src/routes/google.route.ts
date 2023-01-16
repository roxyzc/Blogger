import { Router } from "express";
import passport from "passport";

const route = Router();

route.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/api/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/fail",
    successRedirect: "/api/auth/success",
  })
);

export default route;
