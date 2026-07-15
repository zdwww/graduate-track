import { ObjectId } from "mongodb";
import { getSchoolsCollection } from "../models/Schools.js";

export const getAllSchools = async (req, res) => {
  try {
    const collection = getSchoolsCollection();
    const [data, total] = await Promise.all([
      collection.find().toArray(),
      collection.countDocuments(),
    ]);

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
    const program = await getSchoolsCollection().findOne({
      _id: new ObjectId(req.params.programId),
    });
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }
    return res.status(200).json(program);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
