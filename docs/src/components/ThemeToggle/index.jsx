import styles from "./index.module.css";

import useTheme from "../../helpers/hooks/useTheme";
import { THEME } from "../../helpers/constants/theme";

// "Auto" is kept as a real option rather than a two-state toggle so that following
// the system theme stays available after the user has picked something explicit.
const OPTIONS = [
  { value: THEME.SYSTEM, label: "Auto" },
  { value: THEME.LIGHT, label: "Light" },
  { value: THEME.DARK, label: "Dark" },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.group} role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            className={
              isSelected ? `${styles.option} ${styles.selected}` : styles.option
            }
            aria-pressed={isSelected}
            onClick={() => setTheme(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
