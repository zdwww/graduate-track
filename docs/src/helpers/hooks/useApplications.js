import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications, deleteApplication } from "../apis/applications.js";

const useApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllApplications()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setApplications(data.applications ?? []);
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
  }, []);

  const handleEditClick = (applicationId) => {
    navigate(`/applications/${applicationId}/edit`);
  };

  const handleDelete = async (applicationId) => {
    setDeletingId(applicationId);
    try {
      await deleteApplication(applicationId);
      setApplications((prev) =>
        prev.filter((application) => application._id !== applicationId),
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    if (!statusFilter) {
      return applications;
    }
    return applications.filter(
      (application) => application.status === statusFilter,
    );
  }, [applications, statusFilter]);

  return {
    applications: filteredApplications,
    loading,
    error,
    deletingId,
    statusFilter,
    setStatusFilter,
    handleEditClick,
    handleDelete,
  };
};

export default useApplications;
