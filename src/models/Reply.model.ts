import mongoose, { Schema } from "mongoose";

import { IReply } from "../types/comments.type";

export const ReplySchema = new Schema(
  {
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    authorId: {
      type: Schema.Types.ObjectId || null,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Reply = mongoose.model<IReply>("Reply", ReplySchema);
