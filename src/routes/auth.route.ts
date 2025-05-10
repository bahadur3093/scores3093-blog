import { Router } from "express";

import {
  authenticateMiddleware,
  getAllUser,
  getUserProfile,
  logoutUser,
  registerUser,
  loginUser,
  validateToken,
} from "../controller/auth.controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/users", authenticateMiddleware, getAllUser);
router.get("/auth/logout", authenticateMiddleware, logoutUser);
router.get("/auth/user", authenticateMiddleware, getUserProfile);
router.get("/auth/validate-token", validateToken);

export default router;
