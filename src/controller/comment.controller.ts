import { Request, Response } from "express";

import { Post } from "../models/Post.model";
import { commentValidation } from "../validations/comments.validation";
import { Comment } from "../models/Comment.model";
import { UserRole } from "../constants/user.constant";
import { replyValidation } from "../validations/reply.validation";
import { Reply } from "../models/Reply.model";

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).lean();
    if (!comments || comments.length === 0) {
      res.status(404).json({ error: "No comments found for this post" });
      return;
    }

    res.status(200).json(comments || []);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { error } = commentValidation.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const post = await Post.findById(req.params.postId).lean();
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const comment = new Comment({
      ...req.body,
      postId: post._id,
      parentId: null,
      authorId: req.user.id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const isSuperUser = req.user.role === UserRole.SUPERUSER;
    const isAuthor = comment.authorId.toString() === req.user.id;
    if (!isSuperUser && !isAuthor) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
      return;
    }

    // await deleteCommentAndReplies(commentId);
    const commentToDelete = await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment and its replies deleted successfully",
      comment: commentToDelete,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { error } = commentValidation.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const isAuthor = comment.authorId.toString() === req.user.id;
    if (!isAuthor) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
      return;
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedComment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getRepliesByCommentId = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const replies = await Reply.find({
      commentId: commentId,
    }).lean();
    if (!replies || replies.length === 0) {
      res.status(404).json({ error: "No replies found for this comment" });
      return;
    }

    res.status(200).json(replies || []);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createReply = async (req: Request, res: Response) => {
  try {
    const { error } = replyValidation.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { commentId } = req.params;
    const newReply = new Reply({
      ...req.body,
      commentId,
      authorId: req.user.id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newReply.save();

    res.status(201).json({ reply: newReply });
  } catch (error) {
    res.status(500).json({ message: "Unable to reply to the comment", error });
  }
};

export const updateReply = async (req: Request, res: Response) => {
  try {
    const { error } = replyValidation.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }
    const isAuthor = reply.authorId.toString() === req.user.id;
    if (!isAuthor) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this reply" });
      return;
    }
    const updatedReply = await Reply.findByIdAndUpdate(
      replyId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedReply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }
    res.status(200).json(updatedReply);
  } catch (error) {
    res.status(500).json({ message: "Unable to reply to the comment", error });
  }
};

const deleteCommentAndReplies = async (commentId: string) => {
  const replies = await Comment.find({ parentId: commentId });

  for (const reply of replies) {
    await deleteCommentAndReplies(reply._id.toString());
  }

  await Comment.findByIdAndDelete(commentId);
};
