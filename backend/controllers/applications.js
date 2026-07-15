import { createUser } from "../models/Applications.js";

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
