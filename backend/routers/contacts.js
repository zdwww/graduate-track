import express from "express";

import {
  createNewContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/contacts", requireAuth, getContacts);
router.post("/contacts", requireAuth, createNewContact);
router.get("/contact/:contactId", requireAuth, getContact);
router.patch("/contact/:contactId", requireAuth, updateContact);
router.delete("/contact/:contactId", requireAuth, deleteContact);

export default router;
