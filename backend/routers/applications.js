import express from "express";

import { createApplication } from "../controllers/applications.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// router.get("/application/:id", requireAuth, getAllSchools);
router.post("/applications", requireAuth, createApplication);
// router.patch("/application/:id", requireAuth, getAllSchools);
// router.delete("/application/:id", requireAuth, getAllSchools);

export default router;
