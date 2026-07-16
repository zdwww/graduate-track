import {
  createContact,
  getContactsByUser,
  getContactById,
  updateContactById,
  deleteContactById,
} from "../models/Contacts.js";

// Only these may be set by a client. Prevents a request body from overwriting
// _id, userId, or createdAt.
const EDITABLE_FIELDS = ["name", "school", "role", "email", "notes"];

const pickEditableFields = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => EDITABLE_FIELDS.includes(key)),
  );

export const createNewContact = async (req, res) => {
  try {
    const {
      applicationId,
      name,
      school,
      role,
      email,
      notes,
      facultyId,
      researchAreas,
      profileUrl,
    } = req.body;
    if (!applicationId) {
      return res.status(400).json({ error: "applicationId is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const contact = await createContact({
      userId: req.user._id,
      applicationId,
      name,
      school,
      role,
      email,
      notes,
      facultyId,
      researchAreas,
      profileUrl,
    });

    return res.status(201).json({ contact });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { applicationId } = req.query;
    const contacts = await getContactsByUser(req.user._id, applicationId);
    return res.status(200).json({ contacts });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.status(200).json({ contact });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const updates = pickEditableFields(req.body);
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No editable fields provided" });
    }

    const contact = await updateContactById(contactId, req.user._id, updates);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.status(200).json({ contact });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const deletedCount = await deleteContactById(contactId, req.user._id);
    if (!deletedCount) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
