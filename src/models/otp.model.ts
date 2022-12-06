import { model, Schema, Document } from "mongoose";

interface IOTP {
  email: String;
  OTP: String;
  expiredAt: Date;
}

interface IOTPModel extends IOTP, Document {}

const OtpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    expires: 300, //5 menit
    default: Date.now() + 1000 * 60 * 5,
  },
});

export default model<IOTPModel>("OTP", OtpSchema);
