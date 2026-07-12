import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

import {
  clearToken,
  getCurrentUser,
  getToken,
  login as loginRequest,
  logout as logoutRequest,
  setToken,
  signup as signupRequest,
} from "../apis/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [signupInfo, setSignupInfo] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoginInfoChange = (name) => (event) => {
    setLoginInfo((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSignupInfoChange = (name) => (event) => {
    setSignupInfo((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const login = useCallback(async () => {
    const data = await loginRequest(loginInfo);
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, [loginInfo]);

  const signup = useCallback(async () => {
    const data = await signupRequest(signupInfo);
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, [signupInfo]);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    isAuthenticated,
    loading,
    loginInfo,
    signupInfo,
    user,
    handleLoginInfoChange,
    handleSignupInfoChange,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
