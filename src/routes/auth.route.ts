import { Router } from "express";

import {
  authenticateMiddleware,
  getAllUser,
  registerUser,
  signUpUser,
} from "../controller/auth.controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", signUpUser);
router.get("/auth/users", authenticateMiddleware, getAllUser);

export default router;
