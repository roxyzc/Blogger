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
    failureRedirect: "/api/404",
    successRedirect: "/api/success",
  })
);

export default route;
