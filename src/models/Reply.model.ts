import mongoose, { Schema } from "mongoose";

import { IReply } from "../types/comments.type";

export const ReplySchema = new Schema(
  {
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    replyId: {
      type: Schema.Types.ObjectId,
      required: true,
      default: function (this: { _id: Schema.Types.ObjectId }) {
        return this._id;
      },
    },
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

ReplySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.replyId = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Reply = mongoose.model<IReply>("Reply", ReplySchema);
