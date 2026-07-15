import { request } from "./index.js";

const TOKEN_KEY = "authToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const login = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const signup = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const getCurrentUser = () =>
  request("/auth/me", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const logout = () => {
  clearToken();
};
