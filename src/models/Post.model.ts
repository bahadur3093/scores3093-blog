import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  postId: string;
  title: string;
  content: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  author: string;
  authorId: string;
  cover?: string;
}

const PostSchema: Schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    default: function (this: { _id: Types.ObjectId }) {
      return this._id;
    },
  },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  cover: { type: String, default: null },
});

PostSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.postId = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
