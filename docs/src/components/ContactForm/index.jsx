import PropTypes from "prop-types";
import { useState } from "react";

import styles from "./index.module.css";

const EMPTY_CONTACT = {
  name: "",
  school: "",
  role: "",
  email: "",
  notes: "",
};

const ContactForm = ({
  initialValues = null,
  submitLabel,
  saving = false,
  onSubmit,
  onCancel = null,
}) => {
  const [values, setValues] = useState({ ...EMPTY_CONTACT, ...initialValues });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const succeeded = await onSubmit(values);
    if (succeeded && !initialValues) {
      setValues(EMPTY_CONTACT);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Name *</span>
          <input
            className={styles.input}
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Dr. Jane Smith"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Role</span>
          <input
            className={styles.input}
            name="role"
            type="text"
            value={values.role}
            onChange={handleChange}
            placeholder="Professor"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>School</span>
          <input
            className={styles.input}
            name="school"
            type="text"
            value={values.school}
            onChange={handleChange}
            placeholder="Carnegie Mellon University"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="jsmith@example.edu"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Notes</span>
        <textarea
          className={styles.textarea}
          name="notes"
          rows={2}
          value={values.notes}
          onChange={handleChange}
          placeholder="Met at the fall open house; follow up in October"
        />
      </label>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button className={styles.cancel} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

ContactForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    school: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,
  }),
  submitLabel: PropTypes.string.isRequired,
  saving: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default ContactForm;
