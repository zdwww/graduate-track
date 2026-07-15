import styles from "./index.module.css";

import useSchools from "../../helpers/hooks/useSchools.js";

const SchoolsPage = () => {
  const {
    rows,
    loading,
    error,
    page,
    totalPages,
    schoolNameFilter,
    handleRowClick,
    setSchoolNameFilter,
    goToPreviousPage,
    goToNextPage,
  } = useSchools();

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.status}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Schools</h1>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Filter by school name..."
          value={schoolNameFilter}
          onChange={(e) => setSchoolNameFilter(e.target.value)}
        />
        {rows.length === 0 ? (
          <p className={styles.empty}>No schools found.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Program</th>
                    <th>Degree</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.programId}
                      onClick={() => handleRowClick(row.programId)}
                    >
                      <td>{row.schoolName}</td>
                      <td>{row.programName}</td>
                      <td>{row.degree}</td>
                      <td>
                        <button type="button">+</button>
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
