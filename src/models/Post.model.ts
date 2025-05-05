import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IComment } from "../types/comments.type";
import { CommentSchema } from "./Comment.model";

export interface IPost extends Document {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  comments: IComment[];
}

const PostSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: { type: [CommentSchema], default: [] },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
