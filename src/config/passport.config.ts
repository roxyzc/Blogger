import { Strategy } from "passport-google-oauth20";
import { logger } from "../libraries/Logger.library";
import User from "../models/user.model";
import Token from "../models/token.model";
import { generateAccessToken } from "../utils/token.util";

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
          const findUser = await User.findOne({
            email: profile.emails[0].value as string,
          });
          if (!findUser) {
            const user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              imageGoogle: profile.photos[0].value,
              valid: "active",
              role: "gmail",
            });

            const { accessToken, refreshToken } = await generateAccessToken(
              user.id as string,
              user.role as string
            );
            const token = await Token.create({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
            await Object.assign(user, { token: token._id }).save();
            return done(null, user);
          }

          if (findUser?.token == null || findUser?.token == undefined) {
            const { accessToken, refreshToken } = await generateAccessToken(
              findUser.id as string,
              findUser.role as string
            );
            const createToken = await Token.create({
              accessToken,
              refreshToken,
            });
            await Object.assign(findUser, { token: createToken._id }).save();
          }
          return done(null, findUser);
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
