import { model, Schema, Document, PopulatedDoc, ObjectId } from "mongoose";
import { IUserModel } from "./user.model";

interface IComment {
  userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
  content: String;
  like?: [
    {
      userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
    }
  ];
  comment: [
    {
      commentId: PopulatedDoc<Document<ObjectId> & ICommentModel>;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
  {
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
      required: true,
      min: 3,
      max: 30,
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

export default model<ICommentModel>("Comment", CommentSchema);
