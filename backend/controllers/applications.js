import {
  createApplication as insertApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
} from "../models/Applications.js";

// Only these may be set by a client. Prevents a request body from overwriting
// _id, userId, applicationDate, or the school/program the record was created for.
const EDITABLE_FIELDS = ["status", "notes", "interviewDates"];

const pickEditableFields = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => EDITABLE_FIELDS.includes(key)),
  );

export const createApplication = async (req, res) => {
  try {
    const { schoolName, programId, programName, deadlines } = req.body;
    await insertApplication({
      userId: req.user._id,
      schoolName,
      programId,
      programName,
      deadlines,
    });

    return res
      .status(200)
      .json({ message: "Application is created successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await getAllApplications(req.user._id);
    return res.status(200).json({ applications });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await getApplicationById(applicationId, req.user._id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json({ application });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const updates = pickEditableFields(req.body);
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No editable fields provided" });
    }

    const application = await updateApplicationById(
      applicationId,
      req.user._id,
      updates,
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json({ application });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const deletedCount = await deleteApplicationById(
      applicationId,
      req.user._id,
    );
    if (!deletedCount) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res
      .status(200)
      .json({ message: "Application deleted successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
