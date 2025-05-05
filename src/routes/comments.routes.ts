import { Router } from "express";

import {
  createComment,
  createReply,
  deleteComment,
  getCommentsByPostId,
  getRepliesByCommentId,
  updateComment,
  updateReply,
} from "../controller/comment.controller";
import { authenticateMiddleware } from "../controller/auth.controller";

const router = Router();

router.get(
  "/post/:postId/comments",
  authenticateMiddleware,
  getCommentsByPostId
);
router.post("/post/:postId/comments", authenticateMiddleware, createComment);
router.put("/comments/:commentId", authenticateMiddleware, updateComment);
router.delete("/comments/:commentId", authenticateMiddleware, deleteComment);
router.post("/comments/:commentId/reply", authenticateMiddleware, createReply);
router.get(
  "/comments/:commentId/reply/",
  authenticateMiddleware,
  getRepliesByCommentId
);
router.put("/comments/reply/:replyId", authenticateMiddleware, updateReply);

export default router;
