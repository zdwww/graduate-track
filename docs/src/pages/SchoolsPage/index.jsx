import styles from "./index.module.css";

import useSchools from "../../helpers/hooks/useSchools";

const SchoolsPage = () => {
  const {
    schools,
    loading,
    error,
    page,
    totalPages,
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
        <h1 className={styles.title}>schools</h1>
        {schools.length === 0 ? (
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
                  {schools.map((school) => {
                    return school.programs?.map((program) => (
                      <tr key={program._id}>
                        <td>{school.schoolName}</td>
                        <td>{program.programName}</td>
                        <td>{program.degree}</td>
                        <td>
                          <button type="button">+</button>
                        </td>
                      </tr>
                    ));
                  })}
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
