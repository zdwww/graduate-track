import { ObjectId } from "mongodb";

import { APPLICATION_STATUS } from "../constants/applications.js";
import { getDB } from "../db.js";

export function getApplicationsCollection() {
  return getDB().collection("applications");
}

export async function createApplication({
  userId,
  schoolName,
  programId,
  programName,
  deadlines,
}) {
  const { insertedId } = await getApplicationsCollection().insertOne({
    userId,
    schoolName,
    programId,
    programName,
    deadlines,
    status: APPLICATION_STATUS.DRAFT,
    notes: null,
    interviewDates: null,
    applicationDate: new Date(),
  });
  return { _id: insertedId };
}

export function getAllApplications(userId) {
  return getApplicationsCollection().find({ userId }).toArray();
}

export function getApplicationById(applicationId, userId) {
  return getApplicationsCollection().findOne({
    _id: new ObjectId(applicationId),
    userId,
  });
}

export function updateApplicationById(applicationId, userId, updates) {
  return getApplicationsCollection().findOneAndUpdate(
    { _id: new ObjectId(applicationId), userId },
    { $set: updates },
    { returnDocument: "after" },
  );
}

export async function deleteApplicationById(applicationId, userId) {
  const { deletedCount } = await getApplicationsCollection().deleteOne({
    _id: new ObjectId(applicationId),
    userId,
  });
  return deletedCount;
}
