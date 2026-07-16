import PropTypes from "prop-types";
import { useState } from "react";

import styles from "./index.module.css";

import ContactForm from "../ContactForm/index.jsx";
import ErrorMessage from "../ErrorMessage/index.jsx";
import Loading from "../Loading/index.jsx";

import useContacts from "../../helpers/hooks/useContacts.js";

const Contacts = ({ applicationId }) => {
  const {
    contacts,
    loading,
    error,
    savingId,
    deletingId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useContacts(applicationId);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const onCreate = async (fields) => {
    const succeeded = await handleCreate(fields);
    if (succeeded) {
      setIsAdding(false);
    }
    return succeeded;
  };

  const onUpdate = async (contactId, fields) => {
    const succeeded = await handleUpdate(contactId, fields);
    if (succeeded) {
      setEditingId(null);
    }
    return succeeded;
  };

  const onDelete = (contactId) => {
    if (window.confirm("Delete this contact?")) {
      handleDelete(contactId);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Networking Contacts</h2>
        {!isAdding && (
          <button
            className={styles.addButton}
            type="button"
            onClick={() => setIsAdding(true)}
          >
            + Add Contact
          </button>
        )}
      </div>

      {error && <ErrorMessage error={error} />}

      {isAdding && (
        <ContactForm
          submitLabel="Add Contact"
          saving={savingId === "new"}
          onSubmit={onCreate}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {loading ? (
        <Loading />
      ) : contacts.length === 0 && !isAdding ? (
        <p className={styles.empty}>
          No contacts yet. Add professors, recruiters, or alumni you have talked
          to about this application.
        </p>
      ) : (
        <ul className={styles.list}>
          {contacts.map((contact) =>
            editingId === contact._id ? (
              <li key={contact._id}>
                <ContactForm
                  initialValues={{
                    name: contact.name ?? "",
                    school: contact.school ?? "",
                    role: contact.role ?? "",
                    email: contact.email ?? "",
                    notes: contact.notes ?? "",
                  }}
                  submitLabel="Save Changes"
                  saving={savingId === contact._id}
                  onSubmit={(fields) => onUpdate(contact._id, fields)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li className={styles.item} key={contact._id}>
                <div className={styles.itemMain}>
                  <p className={styles.name}>
                    {contact.name}
                    {contact.role && (
                      <span className={styles.role}> · {contact.role}</span>
                    )}
                  </p>
                  {contact.school && (
                    <p className={styles.meta}>{contact.school}</p>
                  )}
                  {contact.email && (
                    <p className={styles.meta}>
                      <a
                        className={styles.email}
                        href={`mailto:${contact.email}`}
                      >
                        {contact.email}
                      </a>
                    </p>
                  )}
                  {contact.notes && (
                    <p className={styles.notes}>{contact.notes}</p>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <button
                    className={styles.editButton}
                    type="button"
                    onClick={() => setEditingId(contact._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    type="button"
                    onClick={() => onDelete(contact._id)}
                    disabled={deletingId === contact._id}
                  >
                    {deletingId === contact._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
};

Contacts.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default Contacts;
