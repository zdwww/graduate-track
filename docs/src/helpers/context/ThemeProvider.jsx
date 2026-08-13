import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

import { THEME, THEME_STORAGE_KEY } from "../constants/theme";
import { ThemeContext } from "./ThemeContext";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const readStoredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return Object.values(THEME).includes(stored) ? stored : THEME.SYSTEM;
};

const systemTheme = () =>
  window.matchMedia(DARK_QUERY).matches ? THEME.DARK : THEME.LIGHT;

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(readStoredTheme);
  const [system, setSystem] = useState(systemTheme);

  // In "system" mode the OS can change under us (macOS auto-switching at sunset,
  // for instance), so the resolved palette has to follow it live.
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event) =>
      setSystem(event.matches ? THEME.DARK : THEME.LIGHT);

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = theme === THEME.SYSTEM ? system : theme;

  useEffect(() => {
    // The inline script in index.html sets this before first paint to avoid a
    // flash of the wrong palette; this keeps it in sync afterwards.
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
