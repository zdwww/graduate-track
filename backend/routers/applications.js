import express from "express";

import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/applications", requireAuth, getApplications);
router.post("/applications", requireAuth, createApplication);
router.patch("/application/:applicationId", requireAuth, updateApplication);
router.delete("/application/:applicationId", requireAuth, deleteApplication);

export default router;
