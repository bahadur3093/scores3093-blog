import { Router } from "express";

import {
  authenticateMiddleware,
  getAllUser,
  getUserProfile,
  logoutUser,
  registerUser,
  signUpUser,
} from "../controller/auth.controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", signUpUser);
router.get("/auth/users", authenticateMiddleware, getAllUser);
router.get("/auth/logout", authenticateMiddleware, logoutUser);
router.get("/auth/user", authenticateMiddleware, getUserProfile);

export default router;
