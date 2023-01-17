import { Strategy } from "passport-google-oauth20";
import { logger } from "../libraries/Logger.library";
import User from "../models/user.model";
import Token from "../models/token.model";
import Avatar from "../models/avatar.model";
import { generateAccessToken } from "../utils/token.util";
import cloud from "./cloudinary.config";

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
        try {
          const findUser = await User.findOne({
            email: profile.emails[0].value as string,
          }).populate("image");
          if (findUser?.role !== "gmail" && !!findUser)
            throw new Error("sapa lu?");
          if (!findUser) {
            const result = await cloud.uploader.upload(
              profile.photos[0].value as string
            );
            const avatar = await Avatar.create({
              image: result.secure_url,
              cloudinary_id: result.public_id,
              imageGoogle: profile.photos[0].value as string,
            });

            const user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              valid: "active",
              image: avatar.id,
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

          if (
            !(
              findUser.image.imageGoogle === (profile.photos[0].value as string)
            )
          ) {
            console.log("masuk kan bang ke 2?");
            const findAvatar = await Avatar.findById(findUser.image.id);
            if (!findAvatar) throw new Error("error lah pokoknya");
            await cloud.uploader.destroy(findAvatar.cloudinary_id as string);
            const result = await cloud.uploader.upload(
              profile.photos[0].value as string
            );
            await Object.assign(findAvatar, {
              image: result.secure_url,
              cloudinary_id: result.public_id,
              imageGoogle: profile.photos[0].value as string,
            }).save();
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
