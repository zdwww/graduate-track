import { getToken } from "./auth.js";
import { request } from "./index.js";

export const createApplication = (body) =>
  request("/applications", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${getToken()}` },
  });
