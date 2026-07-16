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

  const onEditClick = (event, applicationId) => {
    event.stopPropagation();
    handleEditClick(applicationId);
  };

  const onDeleteClick = (event, applicationId) => {
    event.stopPropagation();
    if (window.confirm("Delete this application?")) {
      handleDelete(applicationId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Applications</h1>
        <select
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
                  <th></th>
                  <th>School</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => {
                  const isExpanded = expandedId === application._id;
                  const deadlines = application.deadlines ?? [];
                  const interviewDates = application.interviewDates ?? [];

                  return (
                    <Fragment key={application._id}>
                      <tr
                        className={styles.row}
                        onClick={() => toggleExpanded(application._id)}
                      >
                        <td className={styles.toggleCell}>
                          <span
                            className={`${styles.chevron} ${
                              isExpanded ? styles.chevronOpen : ""
                            }`}
                          >
                            ▶
                          </span>
                        </td>
                        <td>{application.schoolName}</td>
                        <td>
                          <Link
                            to={`/${application.programId}`}
                            className={styles.programLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {application.programName}
                          </Link>
                        </td>
                        <td>{application.status}</td>
                        <td className={styles.actions}>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={(e) => onEditClick(e, application._id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={(e) => onDeleteClick(e, application._id)}
                            disabled={deletingId === application._id}
                          >
                            {deletingId === application._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className={styles.detailRow}>
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

                              <Contacts applicationId={application._id} />
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
