import {
  createUser,
  getAllApplications,
  updateApplicationById,
  deleteApplicationById,
} from "../models/Applications.js";

export const createApplication = async (req, res) => {
  try {
    const { schoolName, programId, programName, deadlines } = req.body;
    await createUser({ schoolName, programId, programName, deadlines });

    return res
      .status(200)
      .json({ message: "Application is created successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await getAllApplications();
    return res.status(200).json({ applications });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await updateApplicationById(applicationId, req.body);
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
    const deletedCount = await deleteApplicationById(applicationId);
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
