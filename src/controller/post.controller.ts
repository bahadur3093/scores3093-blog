import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

import { postValidation } from "../validations/post.validation";
import { IPost, Post } from "../models/Post.model";

export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 }).lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { error } = await postValidation(req.body as IPost);

    if (error) {
      res.status(400).json({ error: error.details[0].message });

      return;
    }
    const newPost = new Post({
      ...req.body,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const posts = await Post.findById({ _id: id }).lean();
    if (!posts) {
      res.status(404).json({ error: "Post not found" });

      return;
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post", details: error });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { error } = await postValidation(req.body as IPost);

    if (error) {
      res.status(400).json({ error: error.details[0].message });

      return;
    }

    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedPost) {
      res.status(404).json({ error: "Post not found" });

      return;
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post", errors: error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete({ _id: id });
    if (!deletedPost) {
      res.status(404).json({ error: "Post not found" });

      return;
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post", errors: error });
  }
};

export const updatePostContentById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  let { content } = req.body;

  try {
    content = sanitizeHtml(content);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );
    if (!updatedPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update post content", details: error });
  }
};
