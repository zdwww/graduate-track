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

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    password: "",
  });
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
    setLoginInfo({ ...loginInfo, [name]: event.target.value });
  };

  const handleSignupInfoChange = (name) => (event) => {
    setSignupInfo({ ...signupInfo, [name]: event.target.value });
  };

  const login = async () => {
    const data = await loginRequest(loginInfo);
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const signup = async () => {
    const data = await signupRequest(signupInfo);
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    loading,
    loginInfo,
    user,
    handleLoginInfoChange,
    handleSignupInfoChange,
    login,
    logout,
    signup,
  };
};

export default useAuth;
