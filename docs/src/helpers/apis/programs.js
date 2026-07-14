import { getToken } from "./auth";
import { request } from "./index.js";

export const getAllPrograms = ({ page = 1, limit = 20 } = {}) =>
  request(`/programs?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getProgramById = (programId) =>
  request(`/programs${programId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
