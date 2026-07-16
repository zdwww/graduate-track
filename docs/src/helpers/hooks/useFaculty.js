import { useEffect, useState } from "react";

import { getFacultyByProgram } from "../apis/faculty.js";

// Lazy: only fetches when a programId is provided. The caller passes one while
// the add-contact form is open, so a school's faculty loads on demand rather
// than for every expanded application.
const useFaculty = (programId) => {
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!programId) {
      return undefined;
    }

    let isMounted = true;

    getFacultyByProgram(programId)
      .then((data) => {
        if (isMounted) {
          setFaculty(data?.faculty ?? []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [programId]);

  return { faculty, error };
};

export default useFaculty;
