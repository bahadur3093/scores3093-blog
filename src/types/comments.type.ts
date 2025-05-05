import { Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentCommentId: Types.ObjectId;
}

export interface IReply {
  commentId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
