import express from "express";

import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/applications", requireAuth, getApplications);
router.post("/applications", requireAuth, createApplication);
router.get("/application/:applicationId", requireAuth, getApplication);
router.patch("/application/:applicationId", requireAuth, updateApplication);
router.delete("/application/:applicationId", requireAuth, deleteApplication);

export default router;
