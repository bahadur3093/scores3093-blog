import express from "express";

import { authenticateMiddleware } from "../controller/auth.controller";

const router = express.Router();

router.get("/", authenticateMiddleware, (_req, res) => {
  res.send("API is working");
});

export default router;
