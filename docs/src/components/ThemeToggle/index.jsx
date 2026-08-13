import styles from "./index.module.css";

import useTheme from "../../helpers/hooks/useTheme";
import { THEME } from "../../helpers/constants/theme";

// Inline rather than an icon package: three glyphs are not worth a dependency, and
// stroke="currentColor" lets them inherit the palette tokens for free.
const iconProps = {
  className: styles.icon,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

const MonitorIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);

const SunIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg {...iconProps}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

// "Auto" stays a real option rather than a two-state toggle so that following the
// system theme remains available after the user has picked something explicit.
const OPTIONS = [
  { value: THEME.SYSTEM, label: "Follow system theme", Icon: MonitorIcon },
  { value: THEME.LIGHT, label: "Light theme", Icon: SunIcon },
  { value: THEME.DARK, label: "Dark theme", Icon: MoonIcon },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const selectedIndex = OPTIONS.findIndex((option) => option.value === theme);

  return (
    <div
      className={styles.group}
      role="group"
      aria-label="Color theme"
      data-selected={selectedIndex}
    >
      {/* Sits behind the buttons and slides between them; data-selected drives the
          offset so the position stays in CSS rather than an inline style. */}
      <span className={styles.thumb} aria-hidden="true" />
      {OPTIONS.map(({ value, label, Icon }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            className={
              isSelected ? `${styles.option} ${styles.selected}` : styles.option
            }
            aria-pressed={isSelected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
