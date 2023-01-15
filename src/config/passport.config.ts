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
      async (profile: any, _done: any) => {
        const newUser = {
          username: profile.displayName,
          email: profile.email,
          image: profile.photos[0].value,
          password: profile.id,
        };

        try {
          console.log(newUser);
        } catch (error: any) {
          logger.error(error.message);
          throw new Error(error.message);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: String, done: any) => {
    User.findById(id, (err: any, user: any) => {
      done(err, user);
    });
  });
};
