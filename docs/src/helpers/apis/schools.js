import { getToken } from "./auth.js";
import { request } from "./index.js";

export const getAllSchools = ({ page = 1, limit = 20 } = {}) =>
  request(`/schools?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getSchoolById = (programId) =>
  request(`/schools/${programId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
