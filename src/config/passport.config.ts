import { Strategy } from "passport-google-oauth20";
import { logger } from "../libraries/Logger.library";
import User from "../models/user.model";

export const configPassport = (passport: any) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENTID as string,
        clientSecret: process.env.CLIENTSECRET as string,
        callbackURL: "http://localhost:8080/api/auth/callback",
      },
      async (
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        done: any
      ) => {
        // const newUser = {
        //   username: profile.displayName,
        //   email: profile.emails[0].value,
        //   image: profile.photos[0].value,
        //   password: profile.id,
        // };

        try {
          const user = await User.create({
            id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "apaAjaDulu",
            valid: "active",
            role: "gmail",
          });
          done(null, user);
        } catch (error: any) {
          logger.error(error.message);
          done(error.message, null);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: String, done: any) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error: any) {
      done(error, null);
    }
  });
};
