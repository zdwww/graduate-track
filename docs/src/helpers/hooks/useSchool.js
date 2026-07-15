import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSchoolById } from "../apis/schools.js";

const useSchool = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getSchoolById(programId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setProgram(data?.program?.[0] ?? null);
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
  }, [programId]);

  return { program, loading, error };
};

export default useSchool;
