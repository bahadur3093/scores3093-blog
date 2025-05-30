import express, { RequestHandler } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  updatePostContentById,
} from "../controller/post.controller";
import { authenticateMiddleware } from "../controller/auth.controller";

const router = express.Router();

router.get("/post", authenticateMiddleware, getAllPosts);
router.post("/post", authenticateMiddleware, createPost);
router.get("/post/:id", authenticateMiddleware, getPostById);
router.put("/post/:id", authenticateMiddleware, updatePost);
router.delete("/post/:id", authenticateMiddleware, deletePost);
router.put("/post/:postId/content", authenticateMiddleware, updatePostContentById);

export default router;
