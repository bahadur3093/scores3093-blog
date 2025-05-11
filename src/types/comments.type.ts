import { Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReply {
  commentId: Types.ObjectId;
  authorId: Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
