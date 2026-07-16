import { ObjectId } from "mongodb";

import { getDB } from "../db.js";

export function getContactsCollection() {
  return getDB().collection("contacts");
}

export async function createContact({
  userId,
  applicationId,
  name,
  school,
  role,
  email,
  notes,
}) {
  const { insertedId } = await getContactsCollection().insertOne({
    userId,
    applicationId,
    name,
    school: school ?? null,
    role: role ?? null,
    email: email ?? null,
    notes: notes ?? null,
    createdAt: new Date(),
  });
  return { _id: insertedId };
}

export function getContactsByUser(userId, applicationId) {
  const query = { userId };
  if (applicationId) {
    query.applicationId = applicationId;
  }
  return getContactsCollection().find(query).sort({ createdAt: -1 }).toArray();
}

export function getContactById(contactId, userId) {
  return getContactsCollection().findOne({
    _id: new ObjectId(contactId),
    userId,
  });
}

export function updateContactById(contactId, userId, updates) {
  return getContactsCollection().findOneAndUpdate(
    { _id: new ObjectId(contactId), userId },
    { $set: updates },
    { returnDocument: "after" },
  );
}

export async function deleteContactById(contactId, userId) {
  const { deletedCount } = await getContactsCollection().deleteOne({
    _id: new ObjectId(contactId),
    userId,
  });
  return deletedCount;
}
