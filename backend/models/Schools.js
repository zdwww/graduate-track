import { getDB } from "../db.js";

export function getSchoolsCollection() {
  return getDB().collection("catalogs");
}
