import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, updateApplication } from "../apis/applications.js";
import { routerPaths } from "../constants/routes.js";

const useApplicationEdit = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewDates, setInterviewDates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getApplicationById(applicationId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        const fetchedApplication = data?.application ?? null;
        setApplication(fetchedApplication);
        setStatus(fetchedApplication?.status ?? "");
        setNotes(fetchedApplication?.notes ?? "");
        setInterviewDates(fetchedApplication?.interviewDates ?? []);
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

  const addInterviewDate = () => {
    setInterviewDates((prev) => [...prev, ""]);
  };

  const updateInterviewDate = (index, value) => {
    setInterviewDates((prev) =>
      prev.map((date, i) => (i === index ? value : date)),
    );
  };

  const removeInterviewDate = (index) => {
    setInterviewDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await updateApplication(applicationId, {
        status,
        notes,
        interviewDates: interviewDates.filter(Boolean),
      });
      navigate(routerPaths.applications);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(routerPaths.applications);
  };

  return {
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
  };
};

export default useApplicationEdit;
