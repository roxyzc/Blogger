import { model, Schema, Document } from "mongoose";

export interface IToken {
  accessToken?: String;
  refreshToken?: String;
}

export interface ITokenModel extends IToken, Document {}

const TokenSchema: Schema = new Schema(
  {
    accessToken: {
      type: String,
      required: false,
      default: undefined,
    },
    refreshToken: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  { versionKey: false }
);

export default model<ITokenModel>("Token", TokenSchema);
