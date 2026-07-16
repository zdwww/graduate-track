import { getToken } from "./auth.js";
import { request } from "./index.js";

export const createContact = (body) =>
  request("/contacts", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getContactsByApplication = (applicationId) =>
  request(`/contacts?applicationId=${applicationId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateContact = (contactId, body) =>
  request(`/contact/${contactId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteContact = (contactId) =>
  request(`/contact/${contactId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
