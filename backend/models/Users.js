import { ObjectId } from "mongodb";

import { getDB } from "../db.js";

export function getUsersCollection() {
  return getDB().collection("users");
}

export function findUserByEmail(email) {
  return getUsersCollection().findOne({ email });
}

export function findUserById(id) {
  return getUsersCollection().findOne({ _id: new ObjectId(id) });
}

export async function createUser({ email, passwordHash }) {
  const { insertedId } = await getUsersCollection().insertOne({
    email,
    passwordHash,
    createdAt: new Date(),
  });
  return { _id: insertedId, email };
}
