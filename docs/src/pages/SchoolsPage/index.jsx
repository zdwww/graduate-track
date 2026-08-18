import { Link } from "react-router-dom";

import styles from "./index.module.css";

import Loading from "../../components/Loading/index.jsx";

import useSchools from "../../helpers/hooks/useSchools.js";
import ErrorMessage from "../../components/ErrorMessage/index.jsx";

const SchoolsPage = () => {
  const {
    rows,
    loading,
    error,
    page,
    totalPages,
    schoolNameFilter,
    programNameFilter,
    degreeFilter,
    degreeOptions,
    onClickCreateApplication,
    creatingProgramId,
    setSchoolNameFilter,
    setProgramNameFilter,
    setDegreeFilter,
    goToPreviousPage,
    goToNextPage,
  } = useSchools();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Browse Programs</h1>
        <div className={styles.filterRow}>
          <label htmlFor="schoolNameFilter" className={styles.filterLabel}>
            Filter by school name
          </label>
          <input
            id="schoolNameFilter"
            type="text"
            className={styles.filterInput}
            placeholder="Filter by school name..."
            value={schoolNameFilter}
            onChange={(e) => setSchoolNameFilter(e.target.value)}
          />
          <label htmlFor="programNameFilter" className={styles.filterLabel}>
            Filter by program name
          </label>
          <input
            id="programNameFilter"
            type="text"
            className={styles.filterInput}
            placeholder="Filter by program name..."
            value={programNameFilter}
            onChange={(e) => setProgramNameFilter(e.target.value)}
          />
          <label htmlFor="degreeFilter" className={styles.filterLabel}>
            Filter by degree
          </label>
          <select
            id="degreeFilter"
            className={styles.filterSelect}
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
          >
            <option value="">All degrees</option>
            {degreeOptions.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>
        </div>
        {rows.length === 0 ? (
          <p className={styles.empty}>No programs found.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Program</th>
                    <th className={styles.degreeCell}>Degree</th>
                    <th className={styles.actionCell}>
                      <span className={styles.srOnly}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.programId}>
                      <td>{row.schoolName}</td>
                      <td>
                        {/* The program name carries the navigation, not the row:
                            a <tr onClick> is unreachable by keyboard and leaves the
                            detail page mouse-only. The label repeats the school so
                            the link still makes sense out of table context. */}
                        <Link
                          to={`/${row.programId}`}
                          className={styles.programLink}
                          aria-label={`${row.programName} at ${row.schoolName}`}
                        >
                          {row.programName}
                        </Link>
                      </td>
                      <td className={styles.degreeCell}>{row.degree}</td>
                      <td className={styles.actionCell}>
                        <button
                          type="button"
                          className={styles.createButton}
                          onClick={() => onClickCreateApplication(row)}
                          disabled={
                            row.hasApplication ||
                            creatingProgramId === row.programId
                          }
                        >
                          {row.hasApplication
                            ? "Added"
                            : creatingProgramId === row.programId
                              ? "Adding..."
                              : "+ Add"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={goToPreviousPage}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {Math.max(totalPages, 1)}
              </span>
              <button
                type="button"
                className={styles.pageButton}
                onClick={goToNextPage}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;
