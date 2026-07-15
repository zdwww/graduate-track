import { Link } from "react-router-dom";

import styles from "./index.module.css";

import Loading from "../../components/Loading/index.jsx";

import useSchool from "../../helpers/hooks/useSchool.js";
import { routerPaths } from "../../helpers/constants/routes.js";

const LINKS = [
  { key: "programUrl", label: "Program Page" },
  { key: "applicationUrl", label: "Application Info" },
  { key: "requirementsUrl", label: "Degree Requirements" },
];

const SchoolPage = () => {
  const { program, loading, error } = useSchool();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.status}>Program not found.</p>
      </div>
    );
  }

  const deadlines = program.deadlines ?? [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link to={routerPaths.schools} className={styles.backLink}>
          ← Back to Schools
        </Link>

        <h1 className={styles.title}>{program.programName}</h1>
        <div className={styles.meta}>
          {program.degree && (
            <span className={styles.badge}>{program.degree}</span>
          )}
          {program.fieldGroup && (
            <span className={styles.badge}>{program.fieldGroup}</span>
          )}
        </div>

        <div className={styles.linkRow}>
          {LINKS.filter(({ key }) => program[key]).map(({ key, label }) => (
            <a
              key={key}
              href={program[key]}
              target="_blank"
              rel="noreferrer"
              className={styles.linkButton}
            >
              {label}
            </a>
          ))}
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Deadlines</h2>
          {deadlines.length === 0 ? (
            <p className={styles.empty}>No deadlines listed yet.</p>
          ) : (
            <ul className={styles.deadlineList}>
              {deadlines.map((deadline, index) => (
                <li key={index} className={styles.deadlineItem}>
                  {Object.entries(deadline).map(([key, value]) => (
                    <span key={key} className={styles.deadlineField}>
                      <strong>{key}:</strong> {String(value)}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default SchoolPage;
