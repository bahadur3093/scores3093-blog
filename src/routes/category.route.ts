import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controller/category.controller";
import { authenticateMiddleware } from "../controller/auth.controller";

const router = Router();

router.get("/category", authenticateMiddleware, getAllCategories);
router.post("/category", authenticateMiddleware, createCategory);
router.delete("/category/:id", authenticateMiddleware, deleteCategory);

export default router;
