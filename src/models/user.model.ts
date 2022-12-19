import { model, Schema, Document, PopulatedDoc, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { ITokenModel } from "./token.model";
import { IAvatarModel } from "./avatar.model";

export interface IUser {
  username: String;
  email: String;
  password: String;
  role: String;
  valid: Boolean;
  image?: PopulatedDoc<Document<ObjectId> & IAvatarModel>;
  token?: PopulatedDoc<Document<ObjectId> & ITokenModel>;
  createdAt: Date;
  updatedAt: Date;
  expiredAt?: Date;
  comparePassword(password: String): Promise<Boolean>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 30,
    },
    role: {
      enum: ["admin", "user"],
      type: String,
      required: true,
      default: "user",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Avatar",
    },
    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
    token: {
      type: Schema.Types.ObjectId,
      ref: "Token",
    },
    expiredAt: {
      type: Date,
      expires: 3600,
      default: function (this: IUserModel) {
        return this.valid == true || this.role == "admin"
          ? undefined
          : Date.now() + 1000 * 60 * 60;
      },
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (this: IUserModel, next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hash = await bcrypt.hash(this.password as string, salt);
  this.password = hash;
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  const user = this as IUserModel;
  return await bcrypt
    .compare(candidatePassword, user.password as string)
    .catch(() => false);
};

export default model<IUserModel>("User", UserSchema);
