import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSchools } from "../apis/schools.js";
import { createApplication, getAllApplications } from "../apis/applications.js";

const PAGE_SIZE = 15;

const useSchools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [appliedProgramIds, setAppliedProgramIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [schoolNameFilter, setSchoolNameFilter] = useState("");
  const [creatingProgramId, setCreatingProgramId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getAllSchools(), getAllApplications()])
      .then(([schoolsData, applicationsData]) => {
        if (!isMounted) {
          return;
        }
        setSchools(schoolsData.schools ?? []);
        setAppliedProgramIds(
          new Set(
            (applicationsData.applications ?? []).map(
              (application) => application.programId,
            ),
          ),
        );
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

  const handleRowClick = (programId) => {
    navigate(`/${programId}`);
  };

  const onClickCreateApplication = async (e, program) => {
    e.stopPropagation();
    if (appliedProgramIds.has(program.programId)) {
      return;
    }
    setCreatingProgramId(program.programId);
    try {
      await createApplication({
        schoolName: program.schoolName,
        programId: program.programId,
        programName: program.programName,
        deadlines: program.deadlines,
      });
      setAppliedProgramIds((prev) => new Set(prev).add(program.programId));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingProgramId(null);
    }
  };

  const rows = useMemo(() => {
    const term = schoolNameFilter.trim().toLowerCase();
    const filteredSchools = term
      ? schools.filter((school) =>
          school.schoolName?.toLowerCase().includes(term),
        )
      : schools;

    return filteredSchools.flatMap((school) =>
      (school.programs ?? []).map((program) => ({
        ...program,
        schoolName: school.schoolName,
        hasApplication: appliedProgramIds.has(program.programId),
      })),
    );
  }, [schools, schoolNameFilter, appliedProgramIds]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, currentPage]);

  const updateSchoolNameFilter = (value) => {
    setSchoolNameFilter(value);
    setPage(1);
  };

  const goToPreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  return {
    rows: pagedRows,
    loading,
    error,
    page: currentPage,
    totalPages,
    schoolNameFilter,
    handleRowClick,
    onClickCreateApplication,
    creatingProgramId,
    setSchoolNameFilter: updateSchoolNameFilter,
    goToPreviousPage,
    goToNextPage,
  };
};

export default useSchools;
