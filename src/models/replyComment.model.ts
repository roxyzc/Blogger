import { model, Schema, Document, PopulatedDoc, ObjectId } from "mongoose";
import { IUserModel } from "./user.model";
import { ICommentModel } from "./comment.model";

interface IReplyComment {
  userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
  commentId: PopulatedDoc<Document<ObjectId> & ICommentModel>;
  content: String;
  like?: [
    {
      userId: PopulatedDoc<Document<ObjectId> & IUserModel>;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReplyCommentModel extends IReplyComment, Document {}

const ReplyCommentSchema: Schema = new Schema(
  {
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Comment",
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
    tags: [
      {
        replyCommentId: {
          required: true,
          type: Schema.Types.ObjectId,
          ref: "ReplyComment",
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default model<ICommentModel>("ReplyComment", ReplyCommentSchema);
