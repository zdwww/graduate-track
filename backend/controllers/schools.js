import { getSchoolsCollection } from "../models/Schools.js";

export const getAllSchools = async (req, res) => {
  try {
    const collection = getSchoolsCollection();
    const [data, total] = await Promise.all([collection.find().toArray()]);

    return res.status(200).json({
      schools: data[0].schools,
      total,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const collection = getSchoolsCollection();
    const [data] = await Promise.all([collection.find().toArray()]);
    const programs = data[0].schools.flatMap((school) =>
      (school.programs ?? []).map((program) => ({ ...program })),
    );
    const program = programs.filter((program) => {
      return program.programId == req.params.programId;
    });
    return res.status(200).json({ program });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
