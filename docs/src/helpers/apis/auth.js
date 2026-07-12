import { API_BASE } from "../constants/apis";

const TOKEN_KEY = "authToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

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
