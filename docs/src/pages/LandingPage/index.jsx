import { Link } from "react-router-dom";

import styles from "./index.module.css";

import { routerPaths } from "../../helpers/constants/routes";

// Inline SVG for the same reason as ThemeToggle: three glyphs are not worth a
// dependency, and stroke="currentColor" lets them inherit the palette tokens.
const iconProps = {
  className: styles.featureIcon,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.6-3.6" />
  </svg>
);

const ChecklistIcon = () => (
  <svg {...iconProps}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </svg>
);

const ContactsIcon = () => (
  <svg {...iconProps}>
    <circle cx="9.5" cy="9" r="3.5" />
    <path d="M3.5 19.5v-1a5 5 0 0 1 10 0v1" />
    <path d="M16.5 6a3.5 3.5 0 0 1 0 6" />
    <path d="M18 19.5v-1a5 5 0 0 0-2.2-4.1" />
  </svg>
);

// Mirrors the three collections the app is built around, and the order a new user
// meets them: browse a program, track it, then record who you spoke to.
const FEATURES = [
  {
    title: "Browse programs",
    body: "Filter a catalog of schools by name and degree, then open a program for its degree, field, deadlines, and official links.",
    Icon: SearchIcon,
  },
  {
    title: "Track applications",
    body: "Add a program to your list in one click, then keep its status, notes, and interview dates up to date as things move.",
    Icon: ChecklistIcon,
  },
  {
    title: "Keep contacts together",
    body: "Save professors, alumni, and admissions staff against the application they belong to, picking faculty straight from the school's catalog.",
    Icon: ContactsIcon,
  },
];

const LandingPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>For prospective graduate students</p>
          <h1 className={styles.title}>
            Track every graduate application in one place
          </h1>
          <p className={styles.subtitle}>
            Browse programs and deadlines, follow each application&apos;s
            status, and keep the people you have contacted alongside the
            application they belong to — instead of scattered spreadsheets and
            notes.
          </p>

          <div className={styles.actions}>
            <Link to={routerPaths.signup} className={styles.primaryAction}>
              Create an account
            </Link>
            <Link to={routerPaths.login} className={styles.secondaryAction}>
              Log in
            </Link>
          </div>

          <p className={styles.assurance}>
            Your applications and contacts stay private to your account.
          </p>
        </section>

        <section className={styles.features} aria-labelledby="how-it-works">
          <h2 id="how-it-works" className={styles.sectionTitle}>
            How it works
          </h2>
          <ul className={styles.featureList}>
            {FEATURES.map(({ title, body, Icon }) => (
              <li key={title} className={styles.feature}>
                <Icon />
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureBody}>{body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
