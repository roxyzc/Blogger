import { model, Schema, Document } from "mongoose";

interface IOTP {
  OTP: String;
  email: String;
  verify: Boolean;
  expiredAt: Date;
}

interface IOTPModel extends IOTP, Document {}

const OtpSchema: Schema = new Schema(
  {
    OTP: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    verify: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiredAt: {
      type: Date,
      expires: 300, //5 menit
      default: Date.now() + 1000 * 60 * 5,
    },
  },
  { timestamps: true }
);

export default model<IOTPModel>("OTP", OtpSchema);
