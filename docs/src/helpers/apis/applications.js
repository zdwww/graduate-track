import { getToken } from "./auth.js";
import { request } from "./index.js";

export const createApplication = (body) =>
  request("/applications", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getAllApplications = () =>
  request("/applications", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteApplication = (applicationId) =>
  request(`/application/${applicationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getApplicationById = (applicationId) =>
  request(`/application/${applicationId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateApplication = (applicationId, body) =>
  request(`/application/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${getToken()}` },
  });
