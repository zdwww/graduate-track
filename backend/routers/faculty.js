import express from "express";

import { getFacultyForProgram } from "../controllers/faculty.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/faculty", requireAuth, getFacultyForProgram);

export default router;
