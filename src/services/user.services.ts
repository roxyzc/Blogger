import { compare } from "bcrypt";
import User from "../models/user.model";

export const checkAdmin = async (email: string, password: string) => {
  return email === process.env.EMAIL_ADMIN &&
    (await compare(password, process.env.PASSWORD_ADMIN as string))
    ? true
    : false;
};

export const createAdmin = async () => {
  const user = await User.findOne({ email: process.env.EMAIL_ADMIN });
  if (!user) {
    return User.create({
      username: process.env.USERNAME_ADMIN,
      email: process.env.EMAIL_ADMIN,
      password: process.env.PASSWORD_ADMIN,
      role: "admin",
      valid: true,
    });
  }
  return user;
};
