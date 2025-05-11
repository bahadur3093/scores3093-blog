import mongoose, { Schema, Types } from "mongoose";

import { IComment } from "../types/comments.type";

export const CommentSchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
      default: function (this: { _id: Types.ObjectId }) {
        return this._id;
      },
    },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    authorId: {
      type: Schema.Types.ObjectId || null,
      ref: "User",
      required: true,
    },
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CommentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.commentId = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
