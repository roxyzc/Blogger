import Token from "../models/token.model";

export const findTokenInDatabase = async (token: string): Promise<Boolean> => {
  return (await Token.findOne({ accessToken: token })) === null ? false : true;
};
