export const THEME = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

// Stored value is the user's *preference* (including "system"), not the resolved
// palette — otherwise "follow my system" could not survive a reload.
export const THEME_STORAGE_KEY = "theme";
