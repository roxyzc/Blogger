import { model, Schema, Document } from "mongoose";

interface IAvatar {
  image?: String;
  cloudinary_id?: String;
}

export interface IAvatarModel extends IAvatar, Document {}

const AvatarSchema: Schema = new Schema(
  {
    image: {
      type: String,
      unique: true,
    },
    cloudinary_id: {
      type: String,
      unique: true,
    },
  },
  { versionKey: false }
);

export default model<IAvatarModel>("Avatar", AvatarSchema);
