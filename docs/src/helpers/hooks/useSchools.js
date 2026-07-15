import { useEffect, useState } from "react";
import { getAllSchools } from "../apis/schools.js";

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    getAllSchools({ page })
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setSchools(data.schools);
        setTotalPages(data.totalPages);
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
  }, [page]);

  const goToPreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  return {
    schools,
    loading,
    error,
    page,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  };
};

export default useSchools;
