import { Link } from "react-router-dom";

import styles from "./index.module.css";

import ErrorMessage from "../../components/ErrorMessage/index.jsx";
import Loading from "../../components/Loading/index.jsx";

import useApplicationEdit from "../../helpers/hooks/useApplicationEdit.js";
import { routerPaths } from "../../helpers/constants/routes.js";
import { APPLICATION_STATUS } from "../../helpers/constants/applications.js";

const ApplicationEditPage = () => {
  const {
    application,
    status,
    setStatus,
    notes,
    setNotes,
    interviewDates,
    addInterviewDate,
    updateInterviewDate,
    removeInterviewDate,
    loading,
    error,
    saving,
    saveError,
    handleSubmit,
    handleCancel,
  } = useApplicationEdit();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!application) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.status}>Application not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link to={routerPaths.applications} className={styles.backLink}>
          ← Back to Applications
        </Link>

        <h1 className={styles.title}>Edit Application</h1>
        <p className={styles.subtitle}>
          {application.schoolName} — {application.programName}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.values(APPLICATION_STATUS).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              className={styles.textarea}
              value={notes ?? ""}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>

          <div className={styles.formGroup}>
            <span className={styles.label}>Interview Dates</span>
            {interviewDates.length === 0 ? (
              <p className={styles.empty}>No interview dates added.</p>
            ) : (
              <div className={styles.dateList}>
                {interviewDates.map((date, index) => (
                  <div key={index} className={styles.dateRow}>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={date}
                      onChange={(e) =>
                        updateInterviewDate(index, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeInterviewDate(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className={styles.addButton}
              onClick={addInterviewDate}
            >
              + Add Interview Date
            </button>
          </div>

          {saveError && <p className={styles.error}>{saveError}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationEditPage;
