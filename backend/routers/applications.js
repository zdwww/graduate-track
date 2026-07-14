import express from "express";

import { getAllPrograms, getProgramById } from "../controllers/programs.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/programs", requireAuth, getAllPrograms);
router.get("/programs/:programId", requireAuth, getProgramById);

export default router;
