import { Router } from "express";

import { disconnectAll, improveTest2Socket } from "../controller/ai.controller";

const router = Router();

router.post("/improve-text", improveTest2Socket);
router.get("/disconnect-all", disconnectAll);

export default router;
