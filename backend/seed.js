// Standalone, idempotent synthetic-data seeder.
//
// Populates the database with 1,000+ synthetic records (rubric: "Is the database
// populated with at least 1k synthetic records?"). Records are owned by real seeded
// users so per-user isolation still holds.
//
// Design notes:
//   - Own MongoClient (same MONGODB_URI / DB_NAME contract as db.js) so the script can
//     close the connection and exit cleanly — connectDB()/getDB() never expose the client.
//   - Every seeded document carries { seed: true }; a re-run deletes only those docs, so
//     real user data is never touched. The catalogs collection is read-only here.
//   - Zero new dependencies: only `mongodb` + `bcryptjs` (both already used by the app).
//
// Run (local):  node seed.js          (or: npm run seed)
// Run (Atlas):  MONGODB_URI="mongodb+srv://..." DB_NAME=graduate_tracker node seed.js
//               (or: node --env-file=.env seed.js)

import { readFileSync } from "node:fs";

import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";

import { APPLICATION_STATUS } from "./constants/applications.js";

// ---- connection (same env contract as db.js) ----
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "graduate_tracker";

// ---- tunable config ----
const SEED_MARKER = { seed: true };
const SEED_DOMAIN = "seed.local"; // distinct from real/test users; valid for type="email"
const SEED_PASSWORD = "SeedPass123!"; // shared documented demo password
const BCRYPT_ROUNDS = 10; // matches controllers/auth.js

const BULK_USERS = 50; // bulk owners; each sees a realistic slice of the 1k
const BULK_APP_TOTAL = 1000; // guaranteed floor, assigned round-robin (never RNG-dependent)
const SHOWCASE_EMAIL = `demo@${SEED_DOMAIN}`; // one clean login for the demo/video
const SHOWCASE_APPS = 40; // human-scale, visibly-populated list

const CONTACT_APP_RATIO = 0.4; // fraction of applications that get faculty contacts
const CONTACTS_PER_APP_MAX = 3;

const INSERT_CHUNK = 500; // batch size for insertMany (network-friendly on Atlas)
const FALLBACK_CATALOG = "/private/tmp/catalog-full.json"; // used only if the DB has no catalog

const DATE_START = new Date("2025-10-01T00:00:00Z");
const DATE_END = new Date("2026-07-16T00:00:00Z");

const STATUS_WEIGHTS = [
  [APPLICATION_STATUS.DRAFT, 0.35],
  [APPLICATION_STATUS.APPLIED, 0.4],
  [APPLICATION_STATUS.OFFERED, 0.12],
  [APPLICATION_STATUS.REJECTED, 0.13],
];

const NOTE_POOL = [
  null,
  null,
  null,
  "Waiting on recommendation letters.",
  "Reached out to a potential advisor.",
  "Fee waiver approved.",
  "Strong program fit — prioritize.",
  "Need to send official transcripts.",
];

// ---- small helpers (real Node: Math.random / new Date are fine here) ----
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

function pickWeighted(pairs) {
  let r = Math.random();
  for (const [value, weight] of pairs) {
    r -= weight;
    if (r <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

function* chunk(arr, size) {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
}

// ---- catalog loader: prefer the target DB, fall back to the on-disk full catalog ----
async function loadSchools(db) {
  if ((await db.collection("catalogs").countDocuments()) > 0) {
    const doc = await db.collection("catalogs").findOne();
    const schools = doc?.schools ?? [];
    if (schools.length) {
      console.log(`catalog: read ${schools.length} schools from DB`);
      return schools;
    }
  }
  try {
    const parsed = JSON.parse(readFileSync(FALLBACK_CATALOG, "utf8"));
    const schools = parsed?.schools ?? [];
    if (!schools.length) throw new Error("fallback file has no schools");
    console.warn(
      `catalog: DB empty; using fallback ${FALLBACK_CATALOG} (${schools.length} schools)`,
    );
    return schools;
  } catch (e) {
    throw new Error(
      `no catalog available (DB empty and fallback unusable): ${e.message}`,
      { cause: e },
    );
  }
}

// ---- generators (pre-assign _id so children can reference parents before insert) ----
function buildUsers() {
  const users = [{ _id: new ObjectId(), email: SHOWCASE_EMAIL }];
  for (let i = 0; i < BULK_USERS; i++) {
    users.push({ _id: new ObjectId(), email: `seed-user-${i}@${SEED_DOMAIN}` });
  }
  return users;
}

function makeApplication(user, schoolsWithPrograms) {
  const school = randChoice(schoolsWithPrograms);
  const program = randChoice(school.programs);
  const status = pickWeighted(STATUS_WEIGHTS);
  const hasInterview =
    (status === APPLICATION_STATUS.APPLIED ||
      status === APPLICATION_STATUS.OFFERED) &&
    Math.random() < 0.5;
  return {
    _id: new ObjectId(),
    userId: user._id, // ObjectId — matches find({ userId })
    schoolName: school.schoolName,
    programId: program.programId,
    programName: program.programName,
    deadlines: Array.isArray(program.deadlines) ? [...program.deadlines] : [],
    status,
    notes: randChoice(NOTE_POOL),
    interviewDates: hasInterview ? [randDate(DATE_START, DATE_END)] : null,
    applicationDate: randDate(DATE_START, DATE_END),
    ...SEED_MARKER,
  };
}

function buildApplications(users, schoolsWithPrograms) {
  const [showcase, ...bulk] = users;
  const apps = [];
  // exactly BULK_APP_TOTAL apps spread round-robin across the bulk users
  for (let i = 0; i < BULK_APP_TOTAL; i++) {
    apps.push(makeApplication(bulk[i % bulk.length], schoolsWithPrograms));
  }
  // plus a clean showcase set for one login
  for (let i = 0; i < SHOWCASE_APPS; i++) {
    apps.push(makeApplication(showcase, schoolsWithPrograms));
  }
  return apps;
}

function buildContacts(apps, schoolsByName) {
  const contacts = [];
  for (const app of apps) {
    if (Math.random() > CONTACT_APP_RATIO) continue;
    const faculty = schoolsByName.get(app.schoolName)?.faculty ?? [];
    if (!faculty.length) continue;
    const count = randInt(1, CONTACTS_PER_APP_MAX);
    for (let i = 0; i < count; i++) {
      const f = randChoice(faculty);
      contacts.push({
        userId: app.userId, // ObjectId — same owner as the application
        applicationId: app._id.toString(), // STRING — matches the contacts query
        name: f.name,
        school: app.schoolName,
        role: f.title ?? null,
        email: f.publicEmail || `${f.facultyId}@${SEED_DOMAIN}`, // normalize ""
        notes: null,
        facultyId: f.facultyId ?? null,
        researchAreas: f.researchAreas ?? [],
        profileUrl: f.profileUrl || null,
        createdAt: new Date(),
        ...SEED_MARKER,
      });
    }
  }
  return contacts;
}

async function insertAll(collection, docs) {
  for (const batch of chunk(docs, INSERT_CHUNK)) {
    await collection.insertMany(batch, { ordered: false });
  }
}

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`seed: connected to "${DB_NAME}"`);

    const schools = await loadSchools(db);
    const schoolsByName = new Map(schools.map((s) => [s.schoolName, s]));
    const schoolsWithPrograms = schools.filter(
      (s) => Array.isArray(s.programs) && s.programs.length > 0,
    );
    if (!schoolsWithPrograms.length) {
      throw new Error("catalog has no schools with programs");
    }

    // 1) idempotent wipe — marker-scoped only, children first. Never touches real
    //    data (no marker) or the catalogs collection.
    const wiped = {
      contacts: (await db.collection("contacts").deleteMany(SEED_MARKER))
        .deletedCount,
      applications: (
        await db.collection("applications").deleteMany(SEED_MARKER)
      ).deletedCount,
      users: (await db.collection("users").deleteMany(SEED_MARKER))
        .deletedCount,
    };
    console.log("wiped prior seed:", wiped);

    // 2) build
    const users = buildUsers();
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, BCRYPT_ROUNDS);
    const userDocs = users.map((u) => ({
      _id: u._id,
      email: u.email,
      passwordHash,
      createdAt: new Date(),
      ...SEED_MARKER,
    }));
    const appDocs = buildApplications(users, schoolsWithPrograms);
    const contactDocs = buildContacts(appDocs, schoolsByName);

    // 3) insert
    await insertAll(db.collection("users"), userDocs);
    await insertAll(db.collection("applications"), appDocs);
    if (contactDocs.length) {
      await insertAll(db.collection("contacts"), contactDocs);
    }

    // 4) verify + report
    const [uc, ac, cc] = await Promise.all([
      db.collection("users").countDocuments(SEED_MARKER),
      db.collection("applications").countDocuments(SEED_MARKER),
      db.collection("contacts").countDocuments(SEED_MARKER),
    ]);
    console.log(`inserted -> users:${uc} applications:${ac} contacts:${cc}`);
    console.log(
      `RUBRIC: seeded applications=${ac} >= 1000 ? ${ac >= 1000 ? "PASS" : "FAIL"}`,
    );
    console.log(
      `login: ${SHOWCASE_EMAIL} (or seed-user-0..${BULK_USERS - 1}@${SEED_DOMAIN}) / password: ${SEED_PASSWORD}`,
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("seed failed:", err);
  process.exitCode = 1;
});
