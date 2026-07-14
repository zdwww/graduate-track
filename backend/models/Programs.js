import { getDB } from "../db.js";

export function getProgramsCollection() {
  return getDB().collection("programs");
}
