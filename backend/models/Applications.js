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
