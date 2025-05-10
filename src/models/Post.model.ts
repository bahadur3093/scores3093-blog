import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPost extends Document {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  author: string;
  cover?: string;
}

const PostSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  cover: { type: String, default: null },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
