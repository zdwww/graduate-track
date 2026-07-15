import express from "express";

import { getAllSchools, getSchoolById } from "../controllers/schools.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/schools", requireAuth, getAllSchools);
router.get("/schools/:programId", requireAuth, getSchoolById);

export default router;
