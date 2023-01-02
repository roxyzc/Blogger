import { model, Schema, Document, PopulatedDoc, ObjectId } from "mongoose";
import { IAvatarModel } from "./avatar.model";
import { ICommentModel } from "./comment.model";
import { IUserModel } from "./user.model";

interface IBlog {
  userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
  title: String;
  thumbnail: PopulatedDoc<Document<ObjectId> & IAvatarModel>;
  content: String;
  like?: [
    {
      userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
    }
  ];
  comment?: [
    {
      commentId: PopulatedDoc<Document<ObjectId> & ICommentModel>;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogModel extends IBlog, Document {}

const BlogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    content: {
      type: String,
      required: true,
      min: 30,
      max: 5000,
    },
    thumbnail: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Avatar",
    },
    like: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comment: [
      {
        commentId: {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default model<IBlogModel>("Blog", BlogSchema);
