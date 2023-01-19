import { model, Schema, Document } from "mongoose";

interface IAvatar {
  image?: String;
  cloudinary_id?: String;
  // imageGoogle?: String;
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
    },
    // imageGoogle: {
    //   type: String,
    //   default: undefined,
    // },
  },
  { versionKey: false }
);

export default model<IAvatarModel>("Avatar", AvatarSchema);
