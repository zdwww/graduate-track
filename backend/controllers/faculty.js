import { getFacultyByProgramId } from "../models/Faculty.js";

export const getFacultyForProgram = async (req, res) => {
  try {
    const { programId } = req.query;
    if (!programId) {
      return res.status(400).json({ error: "programId is required" });
    }
    const faculty = await getFacultyByProgramId(programId);
    return res.status(200).json({ faculty });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
