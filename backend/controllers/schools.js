import { ObjectId } from "mongodb";
import { getSchoolsCollection } from "../models/Schools.js";

export const getAllSchools = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = {};

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const collection = getSchoolsCollection();
    const [data, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limitNum).toArray(),
      collection.countDocuments(query),
    ]);

    return res.status(200).json({
      schools: data[0].schools,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
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
