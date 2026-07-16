import { getToken } from "./auth.js";
import { request } from "./index.js";

export const getFacultyByProgram = (programId) =>
  request(`/faculty?programId=${encodeURIComponent(programId)}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
