import { ObjectId } from "mongodb";

import { APPLICATION_STATUS } from "../constants/applications.js";
import { getDB } from "../db.js";

export function getApplicationsCollection() {
  return getDB().collection("applications");
}

export async function createUser({
  schoolName,
  programId,
  programName,
  deadlines,
}) {
  const { insertedId } = await getApplicationsCollection().insertOne({
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

export function getAllApplications() {
  return getApplicationsCollection().find().toArray();
}

export function getApplicationById(applicationId) {
  return getApplicationsCollection().findOne({
    _id: new ObjectId(applicationId),
  });
}

export function updateApplicationById(applicationId, updates) {
  return getApplicationsCollection().findOneAndUpdate(
    { _id: new ObjectId(applicationId) },
    { $set: updates },
    { returnDocument: "after" },
  );
}

export async function deleteApplicationById(applicationId) {
  const { deletedCount } = await getApplicationsCollection().deleteOne({
    _id: new ObjectId(applicationId),
  });
  return deletedCount;
}
