import { useCallback, useEffect, useState } from "react";

import {
  createContact,
  getContactsByApplication,
  updateContact,
  deleteContact,
} from "../apis/contacts.js";

const useContacts = (applicationId) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getContactsByApplication(applicationId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setContacts(data.contacts ?? []);
        setError(null);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const handleCreate = useCallback(
    async (fields) => {
      setSavingId("new");
      try {
        await createContact({ ...fields, applicationId });
        const data = await getContactsByApplication(applicationId);
        setContacts(data.contacts ?? []);
        setError(null);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setSavingId(null);
      }
    },
    [applicationId],
  );

  const handleUpdate = useCallback(async (contactId, fields) => {
    setSavingId(contactId);
    try {
      const data = await updateContact(contactId, fields);
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === contactId ? data.contact : contact,
        ),
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSavingId(null);
    }
  }, []);

  const handleDelete = useCallback(async (contactId) => {
    setDeletingId(contactId);
    try {
      await deleteContact(contactId);
      setContacts((prev) =>
        prev.filter((contact) => contact._id !== contactId),
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    contacts,
    loading,
    error,
    savingId,
    deletingId,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

export default useContacts;
