import { getDB } from "../db.js";

function getCatalogsCollection() {
  return getDB().collection("catalogs");
}

// The catalog is a single document holding all schools; each school owns its
// faculty. An application only knows its programId, so the parent school is
// found by scanning schools[].programs[].
export async function getFacultyByProgramId(programId) {
  const catalog = await getCatalogsCollection().findOne();
  const schools = catalog?.schools ?? [];
  const school = schools.find((s) =>
    (s.programs ?? []).some((p) => p.programId === programId),
  );
  return school?.faculty ?? [];
}
