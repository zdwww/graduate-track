// Builds a synthetic school catalog for LOCAL development.
//
// The real catalog is a single document in the `catalogs` collection and lives only
// in the deployed Atlas database. A fresh local MongoDB therefore starts empty, and
// GET /api/schools reads data[0].schools — so with no catalog the Schools page fails
// outright. This script fills that gap so the whole app works offline.
//
// Shape produced (matches what controllers/schools.js and the frontend expect):
//   { synthetic: true, schools: [ { schoolName, faculty: [...], programs: [...] } ] }
//
// SAFETY — two independent guards, because this script REPLACES the catalog document:
//   1. It refuses to run against a non-local MONGODB_URI unless --force is passed.
//   2. It refuses to overwrite an existing catalog that is not marked { synthetic: true },
//      so a real catalog can never be clobbered by accident.
//
// Run:  npm run seed:catalog        (from backend/, reads .env if present)

import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "graduate_tracker";
const FORCE = process.argv.includes("--force");

const PROGRAMS_PER_SCHOOL = [4, 8]; // inclusive range

const SCHOOLS = [
  "Northeastern University",
  "Boston University",
  "Carnegie Mellon University",
  "Columbia University",
  "Cornell University",
  "Duke University",
  "Georgia Institute of Technology",
  "Harvard University",
  "Johns Hopkins University",
  "Massachusetts Institute of Technology",
  "New York University",
  "Northwestern University",
  "Princeton University",
  "Purdue University",
  "Rice University",
  "Stanford University",
  "Tufts University",
  "University of California, Berkeley",
  "University of California, Los Angeles",
  "University of California, San Diego",
  "University of Chicago",
  "University of Illinois Urbana-Champaign",
  "University of Maryland",
  "University of Michigan",
  "University of Minnesota",
  "University of Pennsylvania",
  "University of Southern California",
  "University of Texas at Austin",
  "University of Toronto",
  "University of Washington",
  "University of Wisconsin-Madison",
  "Vanderbilt University",
  "Virginia Tech",
  "Washington University in St. Louis",
  "Yale University",
];

// [programName, degree, fieldGroup]
const PROGRAM_CATALOG = [
  ["Computer Science", "MS", "Computer Science"],
  ["Computer Science", "PhD", "Computer Science"],
  ["Artificial Intelligence", "MS", "Computer Science"],
  ["Human-Computer Interaction", "MS", "Computer Science"],
  ["Cybersecurity", "MS", "Computer Science"],
  ["Software Engineering", "MEng", "Computer Science"],
  ["Data Science", "MS", "Data Science"],
  ["Statistics", "MS", "Data Science"],
  ["Applied Analytics", "MS", "Data Science"],
  ["Electrical Engineering", "MS", "Engineering"],
  ["Electrical and Computer Engineering", "PhD", "Engineering"],
  ["Mechanical Engineering", "MS", "Engineering"],
  ["Robotics", "MS", "Engineering"],
  ["Civil Engineering", "MEng", "Engineering"],
  ["Bioengineering", "PhD", "Life Sciences"],
  ["Bioinformatics", "MS", "Life Sciences"],
  ["Neuroscience", "PhD", "Life Sciences"],
  ["Public Health", "MPH", "Health"],
  ["Health Informatics", "MS", "Health"],
  ["Epidemiology", "PhD", "Health"],
  ["Economics", "PhD", "Social Sciences"],
  ["Public Policy", "MA", "Social Sciences"],
  ["Information Systems", "MS", "Business"],
  ["Business Administration", "MBA", "Business"],
  ["Finance", "MS", "Business"],
];

const FIRST_NAMES = [
  "Aisha",
  "Bruno",
  "Carmen",
  "Daniel",
  "Elena",
  "Farid",
  "Grace",
  "Hiroshi",
  "Ines",
  "Jamal",
  "Katya",
  "Liang",
  "Mira",
  "Noor",
  "Omar",
  "Priya",
  "Quentin",
  "Rosa",
  "Samuel",
  "Tara",
  "Ulf",
  "Valeria",
  "Wei",
  "Yusuf",
  "Zara",
];

const LAST_NAMES = [
  "Abbas",
  "Bennett",
  "Cardoso",
  "Duarte",
  "Eriksson",
  "Fontaine",
  "Gupta",
  "Haddad",
  "Ibrahim",
  "Jensen",
  "Kowalski",
  "Lindqvist",
  "Moreau",
  "Nakamura",
  "Okonkwo",
  "Petrov",
  "Quintero",
  "Rasmussen",
  "Silva",
  "Tanaka",
  "Ueda",
  "Vasquez",
  "Whitfield",
  "Xu",
  "Yamamoto",
  "Zhao",
];

const TITLES = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Teaching Professor",
  "Research Scientist",
  "Director of Graduate Admissions",
];

const TERMS = ["Fall 2027", "Spring 2028"];

// Deterministic PRNG (mulberry32) so repeated runs produce an identical catalog —
// makes local bug reports reproducible between teammates.
function makeRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = makeRandom(20260813);
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function buildFaculty(schoolName, count) {
  const slug = slugify(schoolName);
  const domain = `${slug.split("-")[0]}.edu`;
  const seen = new Set();
  const faculty = [];

  while (faculty.length < count) {
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    if (seen.has(name)) continue;
    seen.add(name);

    const [first, last] = name.toLowerCase().split(" ");
    faculty.push({
      facultyId: `${slug}-fac-${faculty.length + 1}`,
      name: `Dr. ${name}`,
      title: pick(TITLES),
      email: `${first[0]}.${last}@${domain}`,
    });
  }
  return faculty;
}

function buildDeadlines() {
  // 1–2 terms per program; December/January dates like the real catalog.
  const count = randInt(1, 2);
  return TERMS.slice(0, count).map((term, i) => ({
    term,
    date: i === 0 ? `2027-12-${randInt(1, 15)}` : `2028-01-${randInt(5, 20)}`,
  }));
}

function buildSchools() {
  return SCHOOLS.map((schoolName) => {
    const slug = slugify(schoolName);
    const domain = `${slug.split("-")[0]}.edu`;

    // Distinct programs per school, drawn without repeats from the shared catalog.
    const wanted = randInt(...PROGRAMS_PER_SCHOOL);
    const chosen = new Set();
    while (chosen.size < wanted)
      chosen.add(randInt(0, PROGRAM_CATALOG.length - 1));

    const programs = [...chosen].map((idx) => {
      const [programName, degree, fieldGroup] = PROGRAM_CATALOG[idx];
      const programId = `${slug}-${slugify(programName)}-${degree.toLowerCase()}`;
      return {
        programId,
        programName: `${degree} ${programName}`,
        degree,
        fieldGroup,
        programUrl: `https://www.${domain}/grad/${slugify(programName)}`,
        applicationUrl: `https://www.${domain}/grad/${slugify(programName)}/apply`,
        requirementsUrl: `https://www.${domain}/grad/${slugify(programName)}/requirements`,
        deadlines: buildDeadlines(),
      };
    });

    return {
      schoolName,
      faculty: buildFaculty(schoolName, randInt(4, 9)),
      programs,
    };
  });
}

function isLocalUri(uri) {
  return /^mongodb:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$|\?)/.test(uri);
}

async function main() {
  if (!isLocalUri(URI) && !FORCE) {
    console.error(
      [
        "REFUSING TO RUN: MONGODB_URI does not look like a local database.",
        `  MONGODB_URI = ${URI.replace(/\/\/[^@]*@/, "//<credentials>@")}`,
        "",
        "This script REPLACES the catalog document. Running it against the deployed",
        "Atlas database would destroy the real school catalog.",
        "",
        "If you genuinely mean to do this, re-run with --force.",
      ].join("\n"),
    );
    process.exit(1);
  }

  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const catalogs = db.collection("catalogs");

    const existing = await catalogs.findOne();
    if (existing && existing.synthetic !== true && !FORCE) {
      console.error(
        [
          "REFUSING TO RUN: this database already has a catalog that was not created",
          "by this script (no `synthetic: true` marker) — it may be real data.",
          `  db = ${DB_NAME}, catalog _id = ${existing._id}`,
          "",
          "Delete it yourself first, or re-run with --force if you are sure.",
        ].join("\n"),
      );
      process.exit(1);
    }

    const schools = buildSchools();
    const programCount = schools.reduce((n, s) => n + s.programs.length, 0);
    const facultyCount = schools.reduce((n, s) => n + s.faculty.length, 0);

    const doc = {
      synthetic: true,
      generatedAt: new Date(),
      schools,
    };

    if (existing) {
      await catalogs.replaceOne({ _id: existing._id }, doc);
      console.log(`catalog: replaced synthetic catalog in "${DB_NAME}"`);
    } else {
      await catalogs.insertOne(doc);
      console.log(`catalog: inserted new synthetic catalog into "${DB_NAME}"`);
    }

    console.log(
      `  ${schools.length} schools, ${programCount} programs, ${facultyCount} faculty`,
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("seedCatalog failed:", err.message);
  process.exit(1);
});
