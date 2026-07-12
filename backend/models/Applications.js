import { getDB } from "../db.js";

export function getBooksCollection() {
  return getDB().collection("applications");
}
