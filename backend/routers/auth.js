import express from "express";

import { getCurrentUser, login, register } from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, getCurrentUser);

export default router;
