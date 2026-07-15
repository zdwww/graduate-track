import { Link } from "react-router-dom";

import styles from "./index.module.css";
import useApplications from "../../helpers/hooks/useApplications.js";

const ApplicationsPage = () => {
  const {
    applications,
    loading,
    error,
    deletingId,
    handleEditClick,
    handleDelete,
  } = useApplications();

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

  const onDeleteClick = (applicationId) => {
    if (window.confirm("Delete this application?")) {
      handleDelete(applicationId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Applications</h1>
        {applications.length === 0 ? (
          <p className={styles.empty}>No applications found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>School</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td>{application.schoolName}</td>
                    <td>
                      <Link
                        to={`/${application.programId}`}
                        className={styles.programLink}
                      >
                        {application.programName}
                      </Link>
                    </td>
                    <td>{application.status}</td>
                    <td className={styles.actions}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleEditClick(application._id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => onDeleteClick(application._id)}
                        disabled={deletingId === application._id}
                      >
                        {deletingId === application._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
