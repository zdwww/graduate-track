import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./index.module.css";

import Loading from "../../components/Loading/index.jsx";
import ErrorMessage from "../../components/ErrorMessage/index.jsx";
import Contacts from "../../components/Contacts/index.jsx";

import useApplications from "../../helpers/hooks/useApplications.js";
import { APPLICATION_STATUS } from "../../helpers/constants/applications.js";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString();
};

const formatDeadline = (deadline) => {
  if (deadline === null || typeof deadline !== "object") {
    return String(deadline);
  }
  return Object.entries(deadline)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

const ApplicationsPage = () => {
  const {
    applications,
    loading,
    error,
    deletingId,
    statusFilter,
    setStatusFilter,
    handleEditClick,
    handleDelete,
  } = useApplications();
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const toggleExpanded = (applicationId) => {
    setExpandedId((prev) => (prev === applicationId ? null : applicationId));
  };

  const onDeleteClick = (applicationId) => {
    if (window.confirm("Delete this application?")) {
      handleDelete(applicationId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Applications</h1>
        <label htmlFor="statusFilter" className={styles.filterLabel}>
          Filter by status
        </label>
        <select
          id="statusFilter"
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {Object.values(APPLICATION_STATUS).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {applications.length === 0 ? (
          <p className={styles.empty}>No applications found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <span className={styles.srOnly}>Details</span>
                  </th>
                  <th>School</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>
                    <span className={styles.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => {
                  const isExpanded = expandedId === application._id;
                  const deadlines = application.deadlines ?? [];
                  const interviewDates = application.interviewDates ?? [];
                  const detailsId = `application-details-${application._id}`;
                  const detailsLabel = `${isExpanded ? "Hide" : "Show"} details for ${application.programName} at ${application.schoolName}`;

                  return (
                    <Fragment key={application._id}>
                      <tr className={styles.row}>
                        <td className={styles.toggleCell}>
                          {/* A real button rather than a click handler on the <tr>:
                              the row gave keyboard users no way into this panel, and
                              it is the only place notes, deadlines, interview dates
                              and the whole contacts UI live. */}
                          <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => toggleExpanded(application._id)}
                            aria-expanded={isExpanded}
                            aria-controls={isExpanded ? detailsId : undefined}
                            aria-label={detailsLabel}
                          >
                            <span
                              className={`${styles.chevron} ${
                                isExpanded ? styles.chevronOpen : ""
                              }`}
                              aria-hidden="true"
                            >
                              ▶
                            </span>
                          </button>
                        </td>
                        <td>{application.schoolName}</td>
                        <td>
                          <Link
                            to={`/${application.programId}`}
                            className={styles.programLink}
                            aria-label={`${application.programName} at ${application.schoolName}`}
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
                      {isExpanded && (
                        <tr className={styles.detailRow} id={detailsId}>
                          <td colSpan={5}>
                            <div className={styles.detailPanel}>
                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>
                                  Application Date
                                </span>
                                <span>
                                  {formatDate(application.applicationDate)}
                                </span>
                              </div>

                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>
                                  Notes
                                </span>
                                <span>{application.notes || "—"}</span>
                              </div>

                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>
                                  Interview Dates
                                </span>
                                {interviewDates.length === 0 ? (
                                  <span>—</span>
                                ) : (
                                  <ul className={styles.detailList}>
                                    {interviewDates.map((date, index) => (
                                      <li key={index}>{formatDate(date)}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>
                                  Deadlines
                                </span>
                                {deadlines.length === 0 ? (
                                  <span>—</span>
                                ) : (
                                  <ul className={styles.detailList}>
                                    {deadlines.map((deadline, index) => (
                                      <li key={index}>
                                        {formatDeadline(deadline)}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              <Contacts
                                applicationId={application._id}
                                programId={application.programId}
                                schoolName={application.schoolName}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
